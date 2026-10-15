import { ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import type { PurchaseOrder } from '@/data/types';
import { colors } from '@/lib/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';
import { StatusBadge } from './StatusBadge';

interface POCardProps {
  order: PurchaseOrder;
  onPress: () => void;
  /** Overrides the default status line under the PO number. */
  subtitle?: string;
}

export function POCard({ order, onPress, subtitle }: POCardProps) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${order.id}, ${order.statusLabel}`}
      style={styles.card}
    >
      <View style={styles.body}>
        <View style={styles.row}>
          <AppText size={15} weight="semibold">
            {order.id}
          </AppText>
          <StatusBadge risk={order.risk} />
        </View>
        <AppText size={14} color={colors.muted}>
          {subtitle ?? order.statusLabel}
        </AppText>
      </View>
      <ChevronRight size={18} color={colors.muted} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingLeft: 16,
    paddingRight: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    boxShadow: '0 1px 2px rgba(16, 38, 79, 0.08)',
  },
  body: { flex: 1, gap: 2 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
