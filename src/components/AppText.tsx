import { Text, type TextProps } from 'react-native';

import { colors, fontFamily, type FontWeight } from '@/lib/theme';

interface AppTextProps extends TextProps {
  size?: number;
  weight?: FontWeight;
  color?: string;
}

export function AppText({
  size = 15,
  weight = 'regular',
  color = colors.ink,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      {...rest}
      style={[{ fontFamily: fontFamily[weight], fontSize: size, color, lineHeight: Math.round(size * 1.35) }, style]}
    />
  );
}
