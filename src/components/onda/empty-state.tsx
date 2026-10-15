import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, Text, View } from 'react-native';

import { radius, space, text, useOnda } from '@/theme/onda';

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

/** EmptyState do Onda: ícone num círculo com contorno de marca, título e descrição. A ação fica fora. */
export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  const { color } = useOnda();

  return (
    <View style={styles.root}>
      <View
        style={[styles.circle, { backgroundColor: color.bg.brandSubtle, borderColor: color.border.brandSubtle }]}>
        <Icon color={color.icon.brand} size={44} />
      </View>
      <View style={styles.texts}>
        <Text style={[text.heading.large, styles.center, { color: color.text.primary }]} accessibilityRole="header">
          {title}
        </Text>
        <Text style={[text.body.medium, styles.center, { color: color.text.secondary }]}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: space.xl,
  },
  circle: {
    width: 96,
    height: 96,
    borderRadius: radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    alignSelf: 'stretch',
    gap: space.xs,
  },
  center: {
    textAlign: 'center',
  },
});
