import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { AppText } from '@/components/AppText';
import { FilterChips, ListHeader, SearchField } from '@/components/ListChrome';
import { POCard } from '@/components/POCard';
import { RISK_LABEL } from '@/data/mock';
import { useOrders } from '@/data/store';
import { EASE_OUT } from '@/lib/motion';
import { colors } from '@/lib/theme';

type Filter = 'all' | 'at-risk' | 'watching' | 'handled';

export default function FollowUp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const followUps = useMemo(() => orders.filter((o) => o.followUp), [orders]);
  const isHandled = (o: (typeof orders)[number]) => !!o.followUp?.chosenOptionId;

  const options = useMemo(
    () => [
      { key: 'all' as const, label: 'All', count: followUps.length },
      {
        key: 'at-risk' as const,
        label: RISK_LABEL['at-risk'],
        count: followUps.filter((o) => !isHandled(o) && o.risk === 'at-risk').length,
      },
      {
        key: 'watching' as const,
        label: RISK_LABEL.watching,
        count: followUps.filter((o) => !isHandled(o) && o.risk === 'watching').length,
      },
      { key: 'handled' as const, label: 'Being handled', count: followUps.filter(isHandled).length },
    ],
    [followUps],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return followUps.filter((o) => {
      const matches =
        filter === 'all' ||
        (filter === 'handled' ? isHandled(o) : !isHandled(o) && o.risk === filter);
      return matches && (!q || o.id.toLowerCase().includes(q));
    });
  }, [followUps, filter, query]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ListHeader title="Follow-up" />
      <SearchField value={query} onChange={setQuery} />
      <FilterChips options={options} value={filter} onChange={setFilter} />

      <Animated.FlatList
        itemLayoutAnimation={LinearTransition.duration(220).easing(EASE_OUT)}
        data={visible}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const chosen = item.followUp?.options.find((o) => o.id === item.followUp?.chosenOptionId);
          return (
            <View style={styles.cell}>
              <POCard
                order={item}
                subtitle={chosen ? `Action: ${chosen.title}` : item.followUp?.listNote}
                onPress={() => router.push({ pathname: '/follow-up-sheet/[id]', params: { id: item.id } })}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <AppText size={15} color={colors.muted}>
              Nothing to follow up
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
});
