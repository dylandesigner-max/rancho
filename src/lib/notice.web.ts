/** No navegador o `Alert` do React Native não faz nada; usa o alerta nativo do navegador. */
export function showNotice(title: string, message: string): void {
  window.alert(`${title}\n\n${message}`);
}
