import { X } from 'lucide-react-native';
import { useRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AppText } from '@/components/AppText';
import { BottomSheet, type SheetHandle } from '@/components/BottomSheet';
import { FillBar } from '@/components/FillBar';
import { POCard } from '@/components/POCard';
import { StatusBadge } from '@/components/StatusBadge';
import { useOrders } from '@/data/store';
import type { PurchaseOrder } from '@/data/types';
import { VESSELS } from '@/data/vessels';
import { colors } from '@/lib/theme';

const plural = (n: number) => `${n} ${n === 1 ? 'day' : 'days'}`;

function closingNote(order: PurchaseOrder) {
  return order.closingDelta > 0
    ? `${plural(order.closingDelta)} late`
    : `${plural(Math.abs(order.closingDelta))} to spare`;
}

export default function VesselSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const sheet = useRef<SheetHandle>(null);
  const { getOrder } = useOrders();
  const vessel = VESSELS.find((v) => v.id === id);

  if (!vessel) return null;

  const items = vessel.poIds.map(getOrder).filter((o): o is PurchaseOrder => !!o);

  return (
    <BottomSheet ref={sheet} onClose={() => router.back()}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <AppText size={21} weight="semibold" style={styles.grow}>
            {vessel.name}
          </AppText>
          <StatusBadge risk={vessel.risk} />
          <Pressable onPress={() => sheet.current?.close()} hitSlop={12} accessibilityLabel="Close">
            <X size={22} color={colors.ink} />
          </Pressable>
        </View>
        <AppText size={15} color={colors.muted} style={styles.route}>
          {vessel.routeLong}
        </AppText>

        <View style={styles.card}>
          <View style={styles.dates}>
            <View style={styles.grow}>
              <AppText size={13} color={colors.muted}>
                Closing time
              </AppText>
              <AppText size={16} weight="bold">
                {vessel.closing}
              </AppText>
            </View>
            <View style={styles.grow}>
              <AppText size={13} color={colors.muted}>
                Departs
              </AppText>
              <AppText size={16} weight="bold">
                {vessel.departs}
              </AppText>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.slotsRow}>
            <AppText size={14} color={colors.body}>
              Slots filled
            </AppText>
            <AppText size={14} weight="bold">
              {vessel.filled}%
            </AppText>
          </View>
          <View style={styles.bar}>
            <FillBar percent={vessel.filled} height={8} />
          </View>
          <AppText size={13} color={colors.muted}>
            {100 - vessel.filled}% left
          </AppText>
        </View>

        <View style={styles.itemsLabel}>
          <AppText size={14} weight="semibold">
            Items on vessel ({items.length})
          </AppText>
          <AppText size={14} color={colors.muted}>
            {' '}
            · {vessel.ready} ready
          </AppText>
        </View>
        <View style={styles.items}>
          {items.map((order) => (
            <POCard
              key={order.id}
              order={order}
              subtitle={`${order.statusLabel} · ${closingNote(order)}`}
              onPress={() => router.push({ pathname: '/po/[id]', params: { id: order.id } })}
            />
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  grow: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  route: { marginTop: 4, marginBottom: 16 },
  card: { padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
  dates: { flexDirection: 'row' },
  divider: { height: 1, backgroundColor: colors.borderSoft, marginVertical: 14 },
  slotsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  bar: { flexDirection: 'row', marginVertical: 8 },
  itemsLabel: { flexDirection: 'row', alignItems: 'baseline', marginTop: 20, marginBottom: 8 },
  items: { gap: 12 },
});
