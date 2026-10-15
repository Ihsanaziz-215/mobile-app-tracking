import { X } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AiSummaryCard } from '@/components/AiSummaryCard';
import { AppText } from '@/components/AppText';
import { BottomSheet, type SheetHandle } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { ContactRow } from '@/components/ContactRow';
import { PressableScale } from '@/components/PressableScale';
import { useToast } from '@/components/Toast';
import { StatusBadge } from '@/components/StatusBadge';
import { useOrders } from '@/data/store';
import { hapticSelect } from '@/lib/haptics';
import { COLOR_TRANSITION } from '@/lib/motion';
import { colors } from '@/lib/theme';

export default function FollowUpSheet() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getOrder, chooseAction } = useOrders();
  const toast = useToast();
  const sheet = useRef<SheetHandle>(null);
  const order = getOrder(id);
  const followUp = order?.followUp;

  const [selected, setSelected] = useState(
    () => followUp?.chosenOptionId ?? followUp?.options.find((o) => o.recommended)?.id ?? followUp?.options[0]?.id,
  );

  if (!order || !followUp) return null;

  const close = () => sheet.current?.close();
  const confirm = () => {
    if (!selected) return;
    chooseAction(order.id, selected);
    const title = followUp.options.find((o) => o.id === selected)?.title;
    toast.success('Action chosen', `${title} for ${order.id}`);
    close();
  };

  return (
    <BottomSheet
      ref={sheet}
      onClose={() => router.back()}
      full
      footer={<Button label="Choose this action" onPress={confirm} disabled={!selected} style={styles.grow} />}
    >
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <AppText size={21} weight="semibold" style={styles.grow}>
            {order.id}
          </AppText>
          <StatusBadge risk={order.risk} />
          <Pressable onPress={close} hitSlop={12} accessibilityLabel="Close">
            <X size={22} color={colors.ink} />
          </Pressable>
        </View>
        <AppText size={15} color={colors.muted} style={styles.item}>
          {followUp.itemLabel}
        </AppText>

        <AppText size={17} weight="semibold" style={styles.headline}>
          {followUp.headline}
        </AppText>
        <AppText size={14} color={colors.muted} style={styles.cause}>
          Cause: {followUp.cause}
        </AppText>

        <AiSummaryCard text={followUp.aiSummary} />

        <View style={styles.optionsLabel}>
          <AppText size={14} weight="semibold">
            Action options
          </AppText>
          <AppText size={14} color={colors.muted}>
            {' '}
            · tap to choose
          </AppText>
        </View>

        <View style={styles.options}>
          {followUp.options.map((option) => {
            const active = option.id === selected;
            return (
              <PressableScale
                key={option.id}
                onPress={() => {
                  if (!active) hapticSelect();
                  setSelected(option.id);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
              >
              <Animated.View
                style={[
                  styles.option,
                  {
                    backgroundColor: active ? colors.blueSoft : colors.white,
                    borderColor: active ? colors.blue : colors.border,
                  },
                  COLOR_TRANSITION,
                ]}
              >
                <Animated.View
                  style={[
                    styles.radio,
                    {
                      borderColor: active ? colors.blue : colors.borderStrong,
                      backgroundColor: active ? colors.blue : colors.white,
                    },
                    COLOR_TRANSITION,
                  ]}
                />
                <View style={styles.optionBody}>
                  <View style={styles.optionHead}>
                    <AppText size={16} weight="semibold" style={styles.grow}>
                      {option.title}
                    </AppText>
                    <AppText size={15} weight="bold">
                      {option.cost}
                    </AppText>
                  </View>
                  {option.recommended && (
                    <View style={styles.pill}>
                      <AppText size={12} weight="semibold" color={colors.white}>
                        Recommended
                      </AppText>
                    </View>
                  )}
                  <AppText size={14} color={colors.muted}>
                    {option.schedule}
                  </AppText>
                  {option.note && <AppText size={14}>{option.note}</AppText>}
                </View>
              </Animated.View>
              </PressableScale>
            );
          })}
        </View>

        <AppText size={14} weight="semibold" style={styles.contactLabel}>
          Contact
        </AppText>
        <View style={styles.contacts}>
          {followUp.contacts.map((contact) => (
            <ContactRow key={contact.name} contact={contact} />
          ))}
        </View>
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  grow: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  item: { marginTop: 4, marginBottom: 16 },
  headline: { marginBottom: 4 },
  cause: { marginBottom: 16 },
  optionsLabel: { flexDirection: 'row', alignItems: 'baseline', marginTop: 20, marginBottom: 8 },
  options: { gap: 10 },
  option: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  radio: {
    width: 24,
    height: 24,
    marginTop: 1,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  optionBody: { flex: 1, gap: 4 },
  optionHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.navy,
  },
  contactLabel: { marginTop: 24, marginBottom: 8 },
  contacts: { gap: 12 },
});
