# Supabase: contas reais (fase A)

O app já está pronto para usar o Supabase. **Enquanto as chaves não forem configuradas, ele continua no modo simulado de antes** (qualquer e-mail entra), então nada quebra no site publicado.

## O que entra nesta fase

| Parte | Onde fica no Supabase |
|---|---|
| Entrar, criar conta (sem confirmação de e-mail), sair | Authentication |
| Esqueci a senha → e-mail com link → tela **05b · Nova senha** | Authentication (e-mail de recuperação) |
| Nome do perfil | Tabela `profiles` |
| Foto de perfil | Storage, bucket **privado** `avatars` (`<id da conta>/avatar.jpg`) |
| Excluir conta (tela 16) | Função `delete_account()` |

Fica para a **fase B** (depois dos esboços da V2): a compra no Supabase e a sincronização entre aparelhos. Até lá, a compra continua só no aparelho. Por isso "Sair" não apaga a compra.

**Segurança:** cada pessoa só lê e altera o próprio perfil e a própria foto. Isso é garantido pelas regras do banco (RLS) no arquivo `supabase/migrations/20261016000000_contas.sql`, não pelo app.

---

## Passo a passo (uma vez)

### 1. Criar o projeto
1. Entre em [supabase.com](https://supabase.com) e crie uma conta (pode ser com o GitHub).
2. **New project**: nome `rancho`, região **South America (São Paulo)**, plano Free.
3. Guarde a senha do banco num lugar seguro (o app não usa, mas o Supabase pede).

### 2. Criar as tabelas e regras
1. No menu lateral, abra **SQL Editor** → **New query**.
2. Cole o conteúdo inteiro de `supabase/migrations/20261016000000_contas.sql` e clique em **Run**.
3. Deve aparecer "Success". Em **Table Editor** surge a tabela `profiles`; em **Storage**, o bucket `avatars`.

### 3. Configurar o login
Em **Authentication**:
1. **Sign In / Providers → Email**: desligue **Confirm email** (decisão de 16/10) e ponha **Minimum password length = 8** (igual ao app).
2. **URL Configuration**:
   - **Site URL**: `https://rancho.dylan-dsgner.workers.dev`
   - **Redirect URLs** (adicione as duas): `https://rancho.dylan-dsgner.workers.dev/**` e `http://localhost:8081/**`
3. *(Opcional)* **Emails → Reset password**: troque o texto para português, por exemplo:
   - Assunto: `Crie uma nova senha no Rancho`
   - Corpo: `<p>Recebemos um pedido para trocar a senha da sua conta Rancho.</p><p><a href="{{ .ConfirmationURL }}">Criar nova senha</a></p><p>Se não foi você, ignore este e-mail.</p>`

> O e-mail gratuito do Supabase manda **poucos e-mails por hora**. Para testar "Esqueci a senha" várias vezes seguidas, espere um pouco entre os testes. Para uso real, dá para ligar um serviço de e-mail próprio depois (Authentication → Emails → SMTP).

### 4. Pegar as chaves do app
Em **Project Settings → API Keys** (ou **Data API**), copie:
- **Project URL** (ex.: `https://abcd1234.supabase.co`)
- **Publishable key** (começa com `sb_publishable_`)

> Use **só** a publishable key no app. A **secret key** (ou `service_role`) dá acesso total ao banco e **nunca** pode ir para o app nem para o GitHub.

### 5. Ligar no site publicado (Cloudflare)
1. Painel da Cloudflare → **Workers & Pages** → projeto **rancho** → **Settings** → **Build** → **Variables and secrets** (variáveis de *build*).
2. Adicione:
   - `EXPO_PUBLIC_SUPABASE_URL` = Project URL
   - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = Publishable key
3. Rode um novo deploy (**Deployments → Retry deployment**, ou o próximo merge na `main`).

As variáveis `EXPO_PUBLIC_` entram no código na hora do build: depois de trocar, é preciso um build novo.

### 6. *(Opcional)* No computador
Copie `.env.example` para `.env.local` e preencha as duas chaves. O `.env.local` não vai para o GitHub.

### 7. *(Opcional)* Deixar o Claude testar contra o projeto
O ambiente na nuvem do Claude bloqueia o Supabase por padrão. Para liberar: nas configurações do ambiente, **Network access → Allowed domains**, adicione `*.supabase.co` (veja [a documentação](https://code.claude.com/docs/en/cloud-environments#network-access)).

---

## Depois de ligar: o que muda para quem já usa

- Na primeira abertura com as chaves, o app pede login de novo (as contas simuladas não existem no Supabase). **Crie a conta em "Criar conta"**; a compra em andamento continua no aparelho.
- A foto de perfil antiga também fica só no aparelho até ser escolhida de novo (aí ela sobe para o Storage).

## Como testar no iPhone
1. **Criar conta** com um e-mail seu → deve cair direto no Início.
2. **Meu perfil → Editar nome** e **Foto de perfil** → depois confira no Supabase: **Table Editor → profiles** e **Storage → avatars**.
3. **Sair** e **Entrar** de novo → nome e foto voltam.
4. **Esqueci a senha** → abra o link do e-mail **no iPhone** → tela "Criar nova senha" → salvar → Início.
5. **Excluir conta** → a linha some de `profiles` e a conta some de **Authentication → Users**.

## Limitações conhecidas
- **App nativo (Expo Go):** o link de "Esqueci a senha" abre a versão web. O PWA é o alvo desta fase.
- **Sem internet:** entrar e criar conta precisam de conexão. Nome e foto alterados sem internet ficam marcados e sobem quando o app abrir com conexão. Excluir conta precisa de internet.
