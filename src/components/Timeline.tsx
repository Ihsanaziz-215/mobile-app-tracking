import { Check, Factory, FileText, Handshake, Landmark, Package, Ship, Warehouse } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { STAGES } from '@/data/mock';
import { colors } from '@/lib/theme';
import { AppText } from './AppText';

const STAGE_ICONS = [FileText, Factory, Package, Ship, Landmark, Warehouse, Handshake];
const NODE = 32;
const BLOB = 36;
const SWEEP_MS = 900;
const REST_MS = 1500;
const STAGGER_MS = 220;

type LineTone = 'done' | 'active' | 'todo';

const LINE_TONES: Record<LineTone, { base: string; glow: readonly [string, string, string] }> = {
  // Light sweeping over a filled line.
  done: { base: colors.blue, glow: ['rgba(255,255,255,0)', 'rgba(255,255,255,0.85)', 'rgba(255,255,255,0)'] },
  // Progress flowing towards the next stage.
  active: { base: colors.borderSoft, glow: ['rgba(30,76,154,0)', 'rgba(30,76,154,0.95)', 'rgba(30,76,154,0)'] },
  todo: { base: colors.borderSoft, glow: ['rgba(30,76,154,0)', 'rgba(30,76,154,0.3)', 'rgba(30,76,154,0)'] },
};

/**
 * Vertical connector with a gradient that sweeps top to bottom. Each segment
 * starts a little after the previous one, so the glow reads as one flow down
 * the whole timeline. Runs entirely on the UI thread.
 */
function FlowLine({ order, tone }: { order: number; tone: LineTone }) {
  const reduced = useReducedMotion();
  const [height, setHeight] = useState(0);
  const progress = useSharedValue(0);
  const { base, glow } = LINE_TONES[tone];

  useEffect(() => {
    if (reduced || height === 0) return;
    progress.set(0);
    progress.set(
      withDelay(
        order * STAGGER_MS,
        withRepeat(
          withSequence(
            withTiming(1, { duration: SWEEP_MS, easing: Easing.linear }),
            withDelay(REST_MS, withTiming(0, { duration: 0 })),
          ),
          -1,
        ),
      ),
    );
  }, [reduced, height, order, progress]);

  const blobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(progress.get(), [0, 1], [-BLOB, height]) }],
  }));

  return (
    <View style={[styles.line, { backgroundColor: base }]} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
      {!reduced && (
        <Animated.View style={[styles.blob, blobStyle]}>
          <LinearGradient colors={glow} style={StyleSheet.absoluteFill} />
        </Animated.View>
      )}
    </View>
  );
}


export function Timeline({ stage }: { stage: number }) {
  const [hideCompleted, setHideCompleted] = useState(false);
  const rows = STAGES.map((name, i) => ({ name, i })).filter(({ i }) => !(hideCompleted && i < stage));

  return (
    <View>
      {stage > 0 && (
        <Pressable onPress={() => setHideCompleted((v) => !v)} hitSlop={8} style={styles.toggle}>
          <AppText size={15} weight="semibold" color={colors.blue}>
            {hideCompleted ? 'Show completed stages' : 'Hide completed stages'}
          </AppText>
        </Pressable>
      )}
      {rows.map(({ name, i }, idx) => {
        const done = i < stage;
        const current = i === stage;
        const Icon = STAGE_ICONS[i];
        const last = idx === rows.length - 1;
        return (
          <View key={name} style={styles.row}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.node,
                  done && styles.nodeDone,
                  current && styles.nodeCurrent,
                  !done && !current && styles.nodeTodo,
                ]}
              >
                {done ? (
                  <Check size={15} color={colors.blue} strokeWidth={2.5} />
                ) : (
                  <Icon size={15} color={current ? colors.white : colors.muted} />
                )}
              </View>
              {!last && <FlowLine order={idx} tone={done ? 'done' : current ? 'active' : 'todo'} />}
            </View>
            <View style={styles.label}>
              <AppText
                size={15}
                weight={current ? 'bold' : 'regular'}
                color={done || current ? colors.ink : colors.muted}
              >
                {name}
              </AppText>
              {current && (
                <AppText size={13} color={colors.muted}>
                  In progress
                </AppText>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  toggle: { alignSelf: 'flex-start', marginLeft: 44, marginBottom: 14 },
  row: { flexDirection: 'row', gap: 12, minHeight: 56 },
  rail: { width: NODE, alignItems: 'center' },
  node: { width: NODE, height: NODE, borderRadius: NODE / 2, alignItems: 'center', justifyContent: 'center' },
  nodeDone: { backgroundColor: colors.blueBorder },
  nodeCurrent: { backgroundColor: colors.blue, borderWidth: 3, borderColor: colors.blueBorder },
  nodeTodo: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderStrong },
  line: { flex: 1, width: 2, marginVertical: 2, borderRadius: 1, overflow: 'hidden' },
  blob: { position: 'absolute', left: 0, right: 0, top: 0, height: BLOB },
  label: { flex: 1, paddingTop: 5, gap: 2 },
});
