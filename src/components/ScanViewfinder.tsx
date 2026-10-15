import { CameraView } from 'expo-camera';
import { useEffect, type RefObject } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/lib/theme';
import { AppText } from './AppText';

export type ScanStatus = 'scanning' | 'done';

interface ScanViewfinderProps {
  status: ScanStatus;
  cameraGranted: boolean;
  cameraRef: RefObject<CameraView | null>;
  onRequestPermission: () => void;
  onRescan: () => void;
}

const FRAME_HEIGHT = 108;
const SCAN_GREEN = '#1E8E4A';

export function ScanViewfinder({
  status,
  cameraGranted,
  cameraRef,
  onRequestPermission,
  onRescan,
}: ScanViewfinderProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (status === 'scanning' && cameraGranted) {
      progress.value = 0;
      progress.value = withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.quad) }), -1, true);
    } else {
      cancelAnimation(progress);
    }
  }, [status, cameraGranted, progress]);

  const lineStyle = useAnimatedStyle(() => ({ transform: [{ translateY: progress.value * (FRAME_HEIGHT - 2) }] }));

  const done = status === 'done';
  const caption = !cameraGranted
    ? 'Camera access is needed to scan'
    : done
      ? 'Label scanned'
      : 'Point the camera at the PO or carton label';

  return (
    <Pressable
      onPress={done ? onRescan : undefined}
      accessibilityLabel={done ? 'Scan again' : 'Camera preview'}
      accessibilityRole={done ? 'button' : 'image'}
      style={styles.box}
    >
      {cameraGranted && <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />}
      {cameraGranted && <View style={[StyleSheet.absoluteFill, styles.dim]} />}

      {cameraGranted && (
        <View style={styles.center} pointerEvents="none">
          <Animated.View
            style={[
              styles.frame,
              {
                borderColor: done ? SCAN_GREEN : colors.white,
                transitionProperty: 'borderColor',
                transitionDuration: 250,
                transitionTimingFunction: 'ease-out',
              },
            ]}
          >
            {!done && <Animated.View style={[styles.line, lineStyle]} />}
          </Animated.View>
        </View>
      )}

      {!cameraGranted ? (
        <Pressable onPress={onRequestPermission} style={styles.allow} accessibilityRole="button">
          <AppText size={14} weight="semibold" color={colors.white}>
            Allow camera
          </AppText>
        </Pressable>
      ) : null}

      <AppText size={15} color={colors.white} style={styles.caption}>
        {caption}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.ink,
  },
  dim: { backgroundColor: 'rgba(20, 33, 61, 0.35)' },
  center: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', paddingTop: 36 },
  frame: {
    width: 246,
    height: FRAME_HEIGHT,
    borderRadius: 8,
    borderWidth: 1.7,
    borderColor: colors.white,
    overflow: 'hidden',
  },
  line: { position: 'absolute', left: 16, right: 16, height: 2, backgroundColor: '#F1C7C3', borderRadius: 1 },
  caption: { position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center' },
  allow: {
    position: 'absolute',
    top: 72,
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
});
