import { ChevronRight } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/AppText';
import { FillBar } from '@/components/FillBar';
import { PressableScale } from '@/components/PressableScale';
import { FilterChips, ListHeader, SearchField } from '@/components/ListChrome';
import { StatusBadge } from '@/components/StatusBadge';
import { RISK_LABEL } from '@/data/mock';
import type { Risk, Vessel } from '@/data/types';
import { VESSELS } from '@/data/vessels';
import { EASE_OUT } from '@/lib/motion';
import { colors } from '@/lib/theme';

type Filter = 'all' | Risk;

function VesselCard({ vessel, onPress }: { vessel: Vessel; onPress: () => void }) {
  return (
    <PressableScale
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${vessel.name}, ${RISK_LABEL[vessel.risk]}`}
      style={styles.card}
    >
      <View style={styles.body}>
        <View style={styles.row}>
          <AppText size={15} weight="semibold">
            {vessel.name}
          </AppText>
          <StatusBadge risk={vessel.risk} />
        </View>
        <AppText size={14} color={colors.muted}>
          {vessel.route} · closing {vessel.closing}
        </AppText>
        <View style={styles.fillRow}>
          <FillBar percent={vessel.filled} />
          <AppText size={14} color={colors.body}>
            {vessel.filled}% full ·{' '}
            <AppText size={14} weight={vessel.ready > 0 ? 'bold' : 'regular'} color={colors.ink}>
              {vessel.ready}
            </AppText>{' '}
            ready
          </AppText>
        </View>
      </View>
      <ChevronRight size={18} color={colors.muted} />
    </PressableScale>
  );
}

export default function Vessels() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const options = useMemo(
    () => [
      { key: 'all' as const, label: 'All', count: VESSELS.length },
      ...(['at-risk', 'watching', 'on-track'] as const).map((risk) => ({
        key: risk,
        label: RISK_LABEL[risk],
        count: VESSELS.filter((v) => v.risk === risk).length,
      })),
    ],
    [],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VESSELS.filter((v) => (filter === 'all' || v.risk === filter) && (!q || v.name.toLowerCase().includes(q)));
  }, [filter, query]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ListHeader title="Charter vessels" />
      <SearchField value={query} onChange={setQuery} placeholder="search vessel name" />
      <FilterChips options={options} value={filter} onChange={setFilter} />

      <Animated.FlatList
        itemLayoutAnimation={LinearTransition.duration(220).easing(EASE_OUT)}
        data={visible}
        keyExtractor={(v) => v.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.cell}>
            <VesselCard
              vessel={item}
              onPress={() => router.push({ pathname: '/vessel-sheet/[id]', params: { id: item.id } })}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText size={15} color={colors.muted}>
              No matching vessels
            </AppText>
          </View>
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  list: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 24 },
  empty: { alignItems: 'center', paddingTop: 48 },
  cell: { paddingBottom: 12 },
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
  body: { flex: 1, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fillRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
});
