import { Alert } from 'react-native';

/** Aviso simples com um botão OK. Na web usa o alerta do navegador (ver `notice.web.ts`). */
export function showNotice(title: string, message: string): void {
  Alert.alert(title, message);
}
