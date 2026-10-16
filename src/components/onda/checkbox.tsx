import Check from 'lucide-react-native/icons/check';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { radius, space, useOnda } from '@/theme/onda';

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Rótulo. Pode conter links (Text com onPress) — eles abrem sem marcar a caixa. */
  children: ReactNode;
  accessibilityLabel: string;
};

/** Checkbox do Onda: a linha inteira é tocável (mínimo 44 de altura). */
export function Checkbox({ checked, onChange, children, accessibilityLabel }: CheckboxProps) {
  const { color } = useOnda();

  return (
    <Pressable
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel}
      style={styles.root}>
      <View
        style={[
          styles.box,
          { backgroundColor: checked ? color.bg.brand : color.bg.control },
        ]}>
        {checked && <Check color={color.icon.onBrand} size={16} strokeWidth={3} />}
      </View>
      <View style={styles.label}>{children}</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 44,
    paddingVertical: space.xs,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  box: {
    width: 24,
    height: 24,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flex: 1,
  },
});
