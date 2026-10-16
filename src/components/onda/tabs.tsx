import { StyleSheet, View } from 'react-native';

import { radius, space, useOnda } from '@/theme/onda';

import { Tab } from './tab';

type TabsProps<K extends string> = {
  tabs: { key: K; label: string; count?: number }[];
  value: K;
  onChange: (key: K) => void;
};

/** Tabs do Onda: seletor segmentado numa trilha bg/subtle (ex.: Pendentes / No carrinho). */
export function Tabs<K extends string>({ tabs, value, onChange }: TabsProps<K>) {
  const { color } = useOnda();

  return (
    <View style={[styles.root, { backgroundColor: color.bg.subtle }]} accessibilityRole="tablist">
      {tabs.map((t) => (
        <Tab key={t.key} label={t.label} count={t.count} active={t.key === value} onPress={() => onChange(t.key)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderRadius: radius.lg,
    padding: space['2xs'],
    gap: space['2xs'],
  },
});
