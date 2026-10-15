// Imports por peso (subcaminhos) para empacotar só as 5 fontes usadas,
// e não todas as variações do pacote.
import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one/400Regular';
import { NunitoSans_400Regular } from '@expo-google-fonts/nunito-sans/400Regular';
import { NunitoSans_600SemiBold } from '@expo-google-fonts/nunito-sans/600SemiBold';
import { NunitoSans_700Bold } from '@expo-google-fonts/nunito-sans/700Bold';
import { NunitoSans_800ExtraBold } from '@expo-google-fonts/nunito-sans/800ExtraBold';
import { useFonts } from 'expo-font';

/** Carrega as fontes usadas pelos estilos de texto do Onda. Retorna [carregou, erro]. */
export function useOndaFonts() {
  return useFonts({
    LilitaOne_400Regular,
    NunitoSans_400Regular,
    NunitoSans_600SemiBold,
    NunitoSans_700Bold,
    NunitoSans_800ExtraBold,
  });
}
