import { actions, getState } from './store';
import { supabase } from './supabase';

// Perfil no Supabase (tabela profiles + foto no bucket privado "avatars").
// O app mostra sempre o que está no aparelho; daqui sai e chega o que muda.

const AVATAR_FILE = 'avatar.jpg';

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Nome e foto da conta, para guardar no aparelho ao entrar. */
export async function fetchProfile(userId: string): Promise<{ name: string; photoUri: string | null }> {
  if (!supabase) return { name: '', photoUri: null };
  const { data, error } = await supabase.from('profiles').select('name, avatar_path').eq('id', userId).single();
  if (error || !data) return { name: '', photoUri: null };
  let photoUri: string | null = null;
  if (data.avatar_path) {
    const file = await supabase.storage.from('avatars').download(data.avatar_path);
    if (file.data) photoUri = await blobToDataUri(file.data);
  }
  return { name: data.name ?? '', photoUri };
}

/**
 * Envia só o que mudou no aparelho (nome e/ou foto). Sem internet, a marca em
 * `pendingProfile` continua e o envio é tentado de novo ao abrir o app.
 */
export async function syncProfile(): Promise<void> {
  const { pendingProfile, userName, photoUri } = getState();
  if (!supabase || (!pendingProfile.name && !pendingProfile.photo)) return;
  try {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return;
    if (pendingProfile.name) {
      const { error } = await supabase.from('profiles').update({ name: userName ?? '' }).eq('id', user.id);
      if (error) throw error;
      actions.profileSynced('name');
    }
    if (pendingProfile.photo) {
      const path = `${user.id}/${AVATAR_FILE}`;
      const prefix = 'data:image/jpeg;base64,';
      if (photoUri?.startsWith(prefix)) {
        const bytes = base64ToBytes(photoUri.slice(prefix.length));
        const upload = await supabase.storage.from('avatars').upload(path, bytes, { contentType: 'image/jpeg', upsert: true });
        if (upload.error) throw upload.error;
      } else {
        const removal = await supabase.storage.from('avatars').remove([path]);
        if (removal.error) throw removal.error;
      }
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_path: photoUri ? path : null })
        .eq('id', user.id);
      if (error) throw error;
      actions.profileSynced('photo');
    }
  } catch {
    // Fica marcado; tenta de novo na próxima vez.
  }
}

/** Antes de excluir a conta: tira a foto do Storage (a função do banco apaga o resto). */
export async function removeAvatar(userId: string): Promise<void> {
  if (!supabase) return;
  await supabase.storage.from('avatars').remove([`${userId}/${AVATAR_FILE}`]);
}
