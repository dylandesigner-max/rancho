import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/theme/colors';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>Rancho</Text>
        <Text style={styles.slogan}>O controle da sua compra na palma da sua mão.</Text>
      </View>

      <View style={styles.badge}>
        <Text style={styles.badgeText}>Em construção</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  logo: {
    fontSize: 56,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -1,
  },
  slogan: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '500',
    color: colors.text,
    maxWidth: 300,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  badgeText: {
    color: colors.onPrimary,
    fontWeight: '700',
  },
});
