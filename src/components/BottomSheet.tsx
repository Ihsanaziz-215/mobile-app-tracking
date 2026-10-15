import { useCallback, useEffect, useImperativeHandle, type ReactNode, type Ref } from 'react';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { EASE_SHEET, SHEET_SPRING } from '@/lib/motion';
import { colors } from '@/lib/theme';
import { ToastHost } from './Toast';

export interface SheetHandle {
  /** Animates the sheet out, then calls `onClose`. */
  close: () => void;
}

interface BottomSheetProps {
  /** Called once the exit animation has finished. Navigate away here. */
  onClose: () => void;
  ref?: Ref<SheetHandle>;
  /** Fill most of the screen instead of sizing to content. */
  full?: boolean;
  /** Fixed height as a percentage string, overrides `full`. */
  height?: `${number}%`;
  footer?: ReactNode;
  children: ReactNode;
}

// Entrance is a critically damped spring: a long, soft deceleration with no bounce.
const ENTER_SPRING = { duration: 600, dampingRatio: 1 } as const;
const EXIT_MS = 320;
const RESIZE_MS = 380;
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;

export function BottomSheet({ onClose, ref, full, height, footer, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();
  const translateY = useSharedValue(screenH);
  const closing = useSharedValue(false);
  const sizing = height ? { height } : full ? { height: '92%' as const } : { maxHeight: '92%' as const };

  useEffect(() => {
    translateY.set(withSpring(0, { ...ENTER_SPRING, reduceMotion: ReduceMotion.System }));
  }, [translateY]);

  const dismiss = useCallback(() => {
    'worklet';
    if (closing.get()) return;
    closing.set(true);
    translateY.set(
      withTiming(
        screenH,
        { duration: EXIT_MS, easing: EASE_SHEET, reduceMotion: ReduceMotion.System },
        (finished) => {
          if (finished) scheduleOnRN(onClose);
        },
      ),
    );
  }, [closing, translateY, screenH, onClose]);

  useImperativeHandle(ref, () => ({ close: dismiss }), [dismiss]);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (closing.get()) return;
      // Rubber-band when pulled above the resting position.
      translateY.set(e.translationY > 0 ? e.translationY : -Math.pow(-e.translationY, 0.6));
    })
    .onEnd((e) => {
      if (e.velocityY > DISMISS_VELOCITY || e.translationY > DISMISS_DISTANCE) {
        dismiss();
      } else {
        translateY.set(withSpring(0, { ...SHEET_SPRING, velocity: e.velocityY }));
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: translateY.get() }] }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.get(), [0, screenH * 0.6], [1, 0], 'clamp'),
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={dismiss} accessibilityLabel="Close details" />
      </Animated.View>

      <Animated.View
        layout={LinearTransition.duration(RESIZE_MS).easing(EASE_SHEET)}
        style={[styles.sheet, sizing, sheetStyle]}
      >
        <GestureDetector gesture={pan}>
          <View style={styles.handleZone} accessibilityLabel="Drag down to close">
            <View style={styles.grabber} />
          </View>
        </GestureDetector>
        {children}
        {footer ? (
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>{footer}</View>
        ) : (
          <View style={{ height: Math.max(insets.bottom, 16) }} />
        )}
      </Animated.View>
      <ToastHost />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { backgroundColor: colors.backdrop },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  handleZone: { alignItems: 'center', paddingTop: 8, paddingBottom: 12 },
  grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.borderStrong },
  footer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    backgroundColor: colors.white,
  },
});
