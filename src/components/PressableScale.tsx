import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { EASE_OUT, PRESS_IN_MS, PRESS_OUT_MS, PRESS_SCALE } from '@/lib/motion';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PressableScaleProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed. */
  scaleTo?: number;
}

/**
 * Pressable with physical press feedback: scales down on press-in (not on
 * release) and eases back. Runs on the UI thread, so React never re-renders.
 */
export function PressableScale({
  style,
  scaleTo = PRESS_SCALE,
  onPressIn,
  onPressOut,
  disabled,
  ...rest
}: PressableScaleProps) {
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={(e) => {
        scale.set(withTiming(scaleTo, { duration: PRESS_IN_MS, easing: EASE_OUT }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: PRESS_OUT_MS, easing: EASE_OUT }));
        onPressOut?.(e);
      }}
      style={[style, animated]}
    />
  );
}
