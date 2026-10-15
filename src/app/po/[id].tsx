import { ChevronUp, MessageSquare, X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AiSummaryCard } from '@/components/AiSummaryCard';
import { AppText } from '@/components/AppText';
import { BottomSheet, type SheetHandle } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { DetailTabContent, type DetailTab } from '@/components/DetailTabs';
import { PressableScale } from '@/components/PressableScale';
import { StageProgress } from '@/components/StageProgress';
import { StatusBadge } from '@/components/StatusBadge';
import { StatusPicker } from '@/components/StatusPicker';
import { STAGES } from '@/data/mock';
import { useOrders } from '@/data/store';
import { hapticSelect } from '@/lib/haptics';
import { COLOR_TRANSITION } from '@/lib/motion';
import { colors } from '@/lib/theme';

const TABS: { key: DetailTab; label: (count: number) => string }[] = [
  { key: 'timeline', label: () => 'Timeline' },
  { key: 'items', label: (n) => `Items (${n})` },
  { key: 'history', label: () => 'History' },
];

export default function PODetailSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrder, updateStage } = useOrders();
  const toast = useToast();
  const sheet = useRef<SheetHandle>(null);
  const order = getOrder(id);

  const [expanded, setExpanded] = useState(false);
  const [tab, setTab] = useState<DetailTab>('timeline');
  const [picking, setPicking] = useState(false);
  const [selectedStage, setSelectedStage] = useState(0);

  if (!order) return null;

  const close = () => sheet.current?.close();
  const full = expanded || picking;
  const late = order.daysLate > 0;

  const openPicker = () => {
    setSelectedStage(Math.min(order.stage + 1, STAGES.length - 1));
    setPicking(true);
  };

  const save = () => {
    updateStage(order.id, selectedStage);
    toast.success('Status updated', `${order.id} is now ${STAGES[selectedStage]}`);
    setPicking(false);
  };

  return (
    <BottomSheet
      ref={sheet}
      onClose={() => router.back()}
      full={full}
      footer={
        picking ? (
          <>
            <Button label="Cancel" variant="outline" onPress={() => setPicking(false)} />
            <Button label="Save" onPress={save} disabled={selectedStage === order.stage} style={styles.grow} />
          </>
        ) : (
          <>
            <Button label="Update status" onPress={openPicker} style={styles.grow} />
            <Button
              label="Vendor"
              variant="outline"
              icon={<MessageSquare size={17} color={colors.ink} />}
              onPress={() => toast.info('Vendor chat unavailable', 'This feature is coming soon')}
            />
          </>
        )
      }
    >
        {picking ? (
          <Animated.View key="picker" entering={FadeIn.duration(180)} style={styles.fill}>
            <StatusPicker
              poId={order.id}
              selected={selectedStage}
              onSelect={setSelectedStage}
              onBack={() => setPicking(false)}
            />
          </Animated.View>
        ) : (
          <Animated.View key="detail" entering={FadeIn.duration(180)} style={full ? styles.fill : styles.shrink}>
          <ScrollView
            style={full ? styles.scrollFull : styles.scroll}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleRow}>
              <AppText size={21} weight="semibold" style={styles.title}>
                {order.id}
              </AppText>
              <StatusBadge risk={order.risk} />
              <Pressable onPress={close} hitSlop={12} accessibilityLabel="Close" style={styles.close}>
                <X size={22} color={colors.ink} />
              </Pressable>
            </View>
            <AppText size={15} color={colors.muted} style={styles.subtitle}>
              {order.itemsSummary}
            </AppText>

            <View style={styles.card}>
              {late && (
                <AppText size={13} weight="semibold" color={colors.redStrong}>
                  {order.daysLate} {order.daysLate === 1 ? 'day' : 'days'} late
                </AppText>
              )}
              <View style={styles.stageRow}>
                <AppText size={18} weight="semibold">
                  {order.statusLabel}
                </AppText>
                {expanded && (
                  <AppText size={13} color={colors.muted}>
                    Stage {order.stage + 1} of {STAGES.length}
                  </AppText>
                )}
              </View>
              <AppText size={13} color={colors.muted}>
                {order.vessel} · closing {order.closing}
              </AppText>
              {!expanded && (
                <View style={styles.progress}>
                  <StageProgress stage={order.stage} />
                </View>
              )}
              <View style={styles.divider} />
              <View style={styles.dates}>
                <View style={styles.dateCol}>
                  <AppText size={13} color={colors.muted}>
                    Vendor promise
                  </AppText>
                  <AppText size={14} weight="bold">
                    {order.vendorPromise}
                  </AppText>
                </View>
                <View style={styles.dateCol}>
                  <AppText size={13} color={colors.muted}>
                    Estimated ready
                  </AppText>
                  <AppText size={14} weight="bold">
                    {order.estimatedReady}
                  </AppText>
                  {late && (
                    <AppText size={13} weight="medium" color={colors.redStrong}>
                      {order.daysLate} {order.daysLate === 1 ? 'day' : 'days'} later
                    </AppText>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.summary}>
              <AiSummaryCard text={order.summary} />
            </View>

            {!expanded ? (
              <PressableScale onPress={() => setExpanded(true)} style={styles.seeMore} accessibilityRole="button">
                <ChevronUp size={15} color={colors.ink} />
                <AppText size={14} weight="semibold">
                  See more
                </AppText>
              </PressableScale>
            ) : (
              <>
                <View style={styles.tabs}>
                  {TABS.map((t) => {
                    const active = t.key === tab;
                    return (
                      <PressableScale
                        key={t.key}
                        onPress={() => {
                          if (!active) hapticSelect();
                          setTab(t.key);
                        }}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                        style={styles.tabSlot}
                        scaleTo={0.96}
                      >
                        <Animated.View
                          style={[
                            styles.tab,
                            {
                              backgroundColor: active ? colors.white : colors.surface,
                              borderColor: active ? colors.border : colors.surface,
                            },
                            COLOR_TRANSITION,
                          ]}
                        >
                          <AppText
                            size={14}
                            weight={active ? 'semibold' : 'medium'}
                            color={active ? colors.ink : colors.body}
                          >
                            {t.label(order.items.length)}
                          </AppText>
                        </Animated.View>
                      </PressableScale>
                    );
                  })}
                </View>
                <Animated.View key={tab} entering={FadeIn.duration(180)} style={styles.tabBody}>
                  <DetailTabContent tab={tab} order={order} />
                </Animated.View>
              </>
            )}
          </ScrollView>
          </Animated.View>
        )}

    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  scrollFull: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { flex: 1 },
  close: { padding: 2 },
  subtitle: { marginTop: 4, marginBottom: 16 },
  card: {
    padding: 16,
    gap: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progress: { marginTop: 14 },
  divider: { height: 1, backgroundColor: colors.borderSoft, marginVertical: 14 },
  dates: { flexDirection: 'row' },
  dateCol: { flex: 1, gap: 2 },
  summary: { marginTop: 16 },
  seeMore: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    boxShadow: '0 1px 2px rgba(16, 38, 79, 0.08)',
  },
  tabs: {
    flexDirection: 'row',
    marginTop: 20,
    padding: 3,
    borderRadius: 10,
    backgroundColor: colors.surface,
  },
  tabSlot: { flex: 1 },
  tab: { height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 8, borderWidth: 1 },
  tabBody: { marginTop: 16 },
  grow: { flex: 1 },
  fill: { flex: 1 },
  shrink: { flexShrink: 1 },
});
