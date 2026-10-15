import { StyleSheet, View } from 'react-native';

import type { PurchaseOrder } from '@/data/types';
import { colors } from '@/lib/theme';
import { AppText } from './AppText';
import { Timeline } from './Timeline';

export type DetailTab = 'timeline' | 'items' | 'history';

function SourceTag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <AppText size={12} color={colors.body}>
        {label}
      </AppText>
    </View>
  );
}

function SectionTitle({ title, tag }: { title: string; tag: string }) {
  return (
    <View style={styles.sectionTitle}>
      <AppText size={14} weight="semibold">
        {title}
      </AppText>
      <SourceTag label={tag} />
    </View>
  );
}

export function DetailTabContent({ tab, order }: { tab: DetailTab; order: PurchaseOrder }) {
  if (tab === 'timeline') return <Timeline stage={order.stage} />;

  if (tab === 'items') {
    return (
      <View>
        <SectionTitle title="PO contents" tag="From Odoo" />
        {order.items.map((item) => (
          <View key={item.name} style={styles.item}>
            <View style={styles.itemText}>
              <AppText size={15}>{item.name}</AppText>
              <AppText size={14} color={colors.muted}>
                {item.received ? 'Received' : 'Not received yet'}
              </AppText>
            </View>
            <AppText size={15} weight="bold">
              {item.qty} {item.unit}
            </AppText>
          </View>
        ))}
        <View style={{ height: 20 }} />
        <SectionTitle title="Order info" tag="From Odoo" />
        {order.orderInfo.map((row) => (
          <View key={row.label} style={styles.info}>
            <AppText size={14} color={colors.muted}>
              {row.label}
            </AppText>
            <AppText size={14} weight="medium">
              {row.value}
            </AppText>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View>
      {order.history.map((entry, i) => (
        <View key={`${entry.title}-${i}`} style={styles.history}>
          <AppText size={15}>{entry.title}</AppText>
          <AppText size={14} color={colors.muted}>
            {entry.meta}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  itemText: { flex: 1, gap: 2 },
  info: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  history: {
    paddingVertical: 12,
    gap: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
});
