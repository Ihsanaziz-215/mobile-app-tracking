import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/lib/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  icon?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', icon, disabled, style }: ButtonProps) {
  const primary = variant === 'primary';
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={[styles.base, primary ? styles.primary : styles.outline, disabled && { opacity: 0.4 }, style]}
    >
      {icon}
      <AppText size={16} weight="semibold" color={primary ? colors.white : colors.ink}>
        {label}
      </AppText>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  primary: { backgroundColor: colors.navy },
  outline: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
});
