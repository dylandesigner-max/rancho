-- Rancho · Fase A do Supabase: contas reais (perfil, foto e exclusão de conta).
-- Rodar uma vez no SQL Editor do projeto (ver docs/supabase.md).
-- Os dados da compra continuam no aparelho; as tabelas deles vêm na fase B, junto com a V2.

-- ---------------------------------------------------------------------------
-- Perfil: um por conta, criado automaticamente no cadastro.
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  -- Caminho da foto no bucket "avatars" (ex.: <id>/avatar.jpg). null = usa a inicial do nome.
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Cada pessoa só vê e altera o próprio perfil.
create policy "Perfil: ler o próprio"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Perfil: editar o próprio"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Cria o perfil quando a conta nasce, com o nome digitado no cadastro.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mantém updated_at em dia.
create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Foto de perfil: bucket privado, uma pasta por conta (<id>/avatar.jpg).
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', false, 1048576, array['image/jpeg']);

create policy "Foto: ler a própria"
  on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Foto: enviar a própria"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Foto: trocar a própria"
  on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Foto: apagar a própria"
  on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------------------------------------------------------------------------
-- Excluir conta (tela 16): apaga a conta de quem chamou; o perfil vai junto (cascade).
-- O app apaga a foto pelo Storage antes de chamar esta função.
-- ---------------------------------------------------------------------------
create function public.delete_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not authenticated';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke execute on function public.delete_account() from public, anon;
grant execute on function public.delete_account() to authenticated;
