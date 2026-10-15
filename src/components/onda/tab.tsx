import { Pressable, StyleSheet, Text, View } from 'react-native';

import { radius, space, text, useOnda } from '@/theme/onda';

type TabProps = {
  label: string;
  count?: number;
  active: boolean;
  onPress: () => void;
};

/**
 * Tab do Onda (uma aba do Tabs). Ativa: bg/surface com borda border/default, contador
 * text/accent sobre bg/accent-subtle. Inativa: transparente, texto text/secondary.
 */
export function Tab({ label, count, active, onPress }: TabProps) {
  const { color } = useOnda();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={count != null ? `${label}, ${count}` : label}
      style={[
        styles.root,
        active && { backgroundColor: color.bg.surface, borderColor: color.border.default, borderWidth: 1 },
      ]}>
      <Text style={[text.label.medium, { color: active ? color.text.primary : color.text.secondary }]} numberOfLines={1}>
        {label}
      </Text>
      {count != null ? (
        <View style={[styles.count, { backgroundColor: active ? color.bg.accentSubtle : color.bg.surface }]}>
          <Text style={[text.label.small, { color: active ? color.text.accent : color.text.secondary }]}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    height: 40,
    borderRadius: radius.full,
    paddingHorizontal: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
  },
  count: {
    minWidth: 24,
    borderRadius: radius.full,
    paddingHorizontal: space.xs,
    paddingVertical: space['3xs'],
    alignItems: 'center',
  },
});
