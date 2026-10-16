import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

// Conexão com o Supabase (contas, perfil e foto). As chaves vêm do ambiente de build:
// EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver docs/supabase.md).
// A chave "publishable" é pública por natureza: quem protege os dados são as regras (RLS).
// Sem as chaves, `supabase` fica null e o app segue no modo simulado de src/lib/auth.ts.

// Aceita também o endereço copiado de "Data API", que vem com /rest/v1 no fim
// (com ele, o login ia para /rest/v1/auth/v1/... e voltava 404).
const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim()
  .replace(/\/+$/, '')
  .replace(/\/rest\/v1$/, '');
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Na geração do site (npm run build:web) este código roda no Node, sem `window`:
// ali não há sessão a carregar, então o cliente só nasce no navegador ou no celular.
const isStaticRender = Platform.OS === 'web' && typeof window === 'undefined';

export const supabase: SupabaseClient | null =
  url && key && !isStaticRender
    ? createClient(url, key, {
        auth: {
          storage: AsyncStorage,
          persistSession: true,
          autoRefreshToken: true,
          // Na web, o link de "Esqueci a senha" volta com a sessão no endereço.
          detectSessionInUrl: Platform.OS === 'web',
        },
      })
    : null;

// No celular, só renova a sessão com o app em primeiro plano (recomendação do Supabase).
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
