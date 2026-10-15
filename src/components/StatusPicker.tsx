import { ChevronLeft } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { STAGES } from '@/data/mock';
import { hapticSelect } from '@/lib/haptics';
import { COLOR_TRANSITION } from '@/lib/motion';
import { colors } from '@/lib/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

interface StatusPickerProps {
  poId: string;
  selected: number;
  onSelect: (stage: number) => void;
  onBack: () => void;
}

export function StatusPicker({ poId, selected, onSelect, onBack }: StatusPickerProps) {
  return (
    <>
      <View style={styles.header}>
        <Pressable onPress={onBack} hitSlop={12} accessibilityLabel="Back" style={styles.back}>
          <ChevronLeft size={22} color={colors.ink} />
        </Pressable>
        <View>
          <AppText size={19} weight="semibold">
            Choose new status
          </AppText>
          <AppText size={14} color={colors.muted}>
            {poId}
          </AppText>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.list} style={styles.scroll}>
        {STAGES.map((name, i) => {
          const active = i === selected;
          return (
            <PressableScale
              key={name}
              onPress={() => {
                if (!active) hapticSelect();
                onSelect(i);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
            >
              <Animated.View
                style={[
                  styles.row,
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
                <AppText size={15} weight={active ? 'semibold' : 'regular'} color={active ? colors.navy : colors.ink}>
                  {name}
                </AppText>
              </Animated.View>
            </PressableScale>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  back: { padding: 4 },
  scroll: { flex: 1 },
  list: { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
  },
});
