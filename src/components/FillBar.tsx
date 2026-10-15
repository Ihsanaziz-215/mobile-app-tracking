import { StyleSheet, View } from 'react-native';

import { colors } from '@/lib/theme';

export function FillBar({ percent, height = 6 }: { percent: number; height?: number }) {
  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View style={[styles.fill, { width: `${percent}%`, borderRadius: height / 2 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { flex: 1, backgroundColor: colors.segmentEmpty, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.blue },
});
