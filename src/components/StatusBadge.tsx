import { Check, CircleAlert, Eye } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { RISK_LABEL } from '@/data/mock';
import type { Risk } from '@/data/types';
import { colors } from '@/lib/theme';
import { AppText } from './AppText';

const VARIANTS = {
  'at-risk': { bg: colors.redBg, fg: colors.redText, icon: CircleAlert, iconColor: colors.red },
  watching: { bg: colors.amberBg, fg: colors.amberText, icon: Eye, iconColor: colors.amber },
  'on-track': { bg: colors.surface, fg: colors.body, icon: Check, iconColor: colors.muted },
} as const;

export function StatusBadge({ risk }: { risk: Risk }) {
  const { bg, fg, icon: Icon, iconColor } = VARIANTS[risk];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Icon size={13} color={iconColor} strokeWidth={2.2} />
      <AppText size={13} weight="medium" color={fg}>
        {RISK_LABEL[risk]}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
});
