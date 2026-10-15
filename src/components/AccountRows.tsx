import { StyleSheet, Switch, View } from 'react-native';

import { hapticSelect } from '@/lib/haptics';
import { colors } from '@/lib/theme';
import { AppText } from './AppText';

export function SectionLabel({ children }: { children: string }) {
  return (
    <AppText size={14} weight="semibold" style={styles.sectionLabel}>
      {children}
    </AppText>
  );
}

/** Bordered card that stacks rows with hairline dividers. */
export function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, !last && styles.divider]}>
      <AppText size={14} color={colors.muted}>
        {label}
      </AppText>
      <AppText size={15} weight="medium" style={styles.value} numberOfLines={1}>
        {value}
      </AppText>
    </View>
  );
}

interface SwitchRowProps {
  label: string;
  hint: string;
  value: boolean;
  onChange: (value: boolean) => void;
  last?: boolean;
}

export function SwitchRow({ label, hint, value, onChange, last }: SwitchRowProps) {
  return (
    <View style={[styles.row, !last && styles.divider]}>
      <View style={styles.switchText}>
        <AppText size={15} weight="medium">
          {label}
        </AppText>
        <AppText size={13} color={colors.muted}>
          {hint}
        </AppText>
      </View>
      <Switch
        value={value}
        onValueChange={(next) => {
          hapticSelect();
          onChange(next);
        }}
        trackColor={{ false: colors.borderStrong, true: colors.blue }}
        thumbColor={colors.white}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionLabel: { marginBottom: 8 },
  card: { borderRadius: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  value: { flexShrink: 1, textAlign: 'right' },
  switchText: { flex: 1, gap: 2 },
});
