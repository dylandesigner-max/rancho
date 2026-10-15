import { router } from 'expo-router';
import ArrowLeft from 'lucide-react-native/icons/arrow-left';
import { StyleSheet, Text, View } from 'react-native';

import { space, text, useOnda } from '@/theme/onda';

import { IconButton } from './icon-button';

type TopBarProps = {
  title?: string;
  onBack?: () => void;
};

/** TopBar do Onda: voltar + título opcional (Heading/Medium). Altura 44. */
export function TopBar({ title, onBack }: TopBarProps) {
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')));
  const { color } = useOnda();

  return (
    <View style={styles.root}>
      <IconButton
        accessibilityLabel="Voltar"
        onPress={back}
        icon={<ArrowLeft color={color.icon.primary} size={24} />}
      />
      {title ? (
        <Text style={[text.heading.medium, styles.title, { color: color.text.primary }]} numberOfLines={1} accessibilityRole="header">
          {title}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space['2xs'],
    paddingLeft: space.sm,
    paddingRight: space.xl,
  },
  title: {
    flex: 1,
  },
});
