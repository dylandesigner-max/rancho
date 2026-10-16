import CircleAlert from 'lucide-react-native/icons/circle-alert';
import Eye from 'lucide-react-native/icons/eye';
import EyeOff from 'lucide-react-native/icons/eye-off';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { radius, space, text, useOnda } from '@/theme/onda';

import { noWebFocusOutline } from './web-styles';

type TextFieldProps = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
  /** Texto de ajuda abaixo do campo (ex.: regra da senha). */
  helper?: string;
  /** true = só o fundo de erro; string = fundo de erro + mensagem no lugar do helper. */
  error?: boolean | string;
  /** Campo de senha com botão de mostrar/ocultar. */
  password?: boolean;
};

/** TextField do Onda: rótulo, campo de 52, ajuda/erro. Sem contorno: foco e erro mudam a cor do fundo. */
export function TextField({ label, helper, error, password = false, onFocus, onBlur, ...input }: TextFieldProps) {
  const { color } = useOnda();
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);

  const hasError = !!error;
  const message = typeof error === 'string' ? error : helper;
  const background = hasError ? color.bg.dangerSubtle : focused ? color.bg.brandSubtle : color.bg.subtle;

  return (
    <View style={styles.root}>
      <Text style={[text.label.medium, { color: color.text.primary }]}>{label}</Text>
      <View
        style={[
          styles.box,
          {
            backgroundColor: background,
            paddingLeft: space.md,
            paddingRight: password ? space['2xs'] : space.md,
          },
        ]}>
        <TextInput
          {...input}
          accessibilityLabel={label}
          secureTextEntry={password && !visible}
          placeholderTextColor={color.text.tertiary}
          selectionColor={color.border.focus}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[styles.input, { color: color.text.primary }, noWebFocusOutline]}
        />
        {password && (
          <Pressable
            onPress={() => setVisible((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
            hitSlop={8}
            style={styles.toggle}>
            {visible ? (
              <EyeOff color={color.icon.secondary} size={22} />
            ) : (
              <Eye color={color.icon.secondary} size={22} />
            )}
          </Pressable>
        )}
      </View>
      {message ? (
        <View style={styles.helper}>
          {hasError && <CircleAlert color={color.icon.danger} size={16} />}
          <Text
            style={[text.caption, styles.helperText, { color: hasError ? color.text.danger : color.text.secondary }]}
            accessibilityLiveRegion={hasError ? 'polite' : 'none'}>
            {message}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: space.xs,
  },
  box: {
    height: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    // Na web o campo tem largura própria (atributo size); assim ele cabe no espaço.
    flexBasis: 0,
    minWidth: 0,
    height: '100%',
    fontFamily: text.body.medium.fontFamily,
    fontSize: text.body.medium.fontSize,
    // Sem lineHeight: no Android ele corta o texto do TextInput.
    paddingVertical: Platform.OS === 'android' ? 0 : undefined,
  },
  toggle: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space['2xs'],
  },
  helperText: {
    flex: 1,
  },
});
