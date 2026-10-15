import { ScanLine } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/AppText';
import { FilterChips, ListHeader, SearchField } from '@/components/ListChrome';
import { POCard } from '@/components/POCard';
import { PressableScale } from '@/components/PressableScale';
import { RISK_LABEL } from '@/data/mock';
import { useOrders } from '@/data/store';
import type { Risk } from '@/data/types';
import { EASE_OUT } from '@/lib/motion';
import { colors } from '@/lib/theme';

type Filter = 'all' | Risk;

export default function ActiveItems() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const options = useMemo(
    () => [
      { key: 'all' as const, label: 'All', count: orders.length },
      ...(['at-risk', 'watching', 'on-track'] as const).map((risk) => ({
        key: risk,
        label: RISK_LABEL[risk],
        count: orders.filter((o) => o.risk === risk).length,
      })),
    ],
    [orders],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter(
      (o) => (filter === 'all' || o.risk === filter) && (!q || o.id.toLowerCase().includes(q)),
    );
  }, [orders, filter, query]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ListHeader title="Active items" />
      <SearchField value={query} onChange={setQuery} />
      <FilterChips options={options} value={filter} onChange={setFilter} />

      <Animated.FlatList
        itemLayoutAnimation={LinearTransition.duration(220).easing(EASE_OUT)}
        data={visible}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <POCard order={item} onPress={() => router.push({ pathname: '/po/[id]', params: { id: item.id } })} />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText size={15} color={colors.muted}>
              No matching purchase orders
            </AppText>
          </View>
        }
        keyboardShouldPersistTaps="handled"
      />

      <PressableScale
        onPress={() => router.push('/scan')}
        scaleTo={0.95}
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel="Scan"
      >
        <ScanLine size={20} color={colors.white} />
        <AppText size={15} weight="semibold" color={colors.white}>
          Scan
        </AppText>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 96 },
  empty: { alignItems: 'center', paddingTop: 48 },
  cell: { paddingBottom: 12 },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 26,
    backgroundColor: colors.navy,
    boxShadow: '0 4px 12px rgba(14, 40, 79, 0.28)',
  },
});
