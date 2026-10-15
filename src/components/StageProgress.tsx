import { StyleSheet, View } from 'react-native';

import { STAGES } from '@/data/mock';
import { colors } from '@/lib/theme';

export function StageProgress({ stage }: { stage: number }) {
  return (
    <View style={styles.row} accessibilityLabel={`Stage ${stage + 1} of ${STAGES.length}`}>
      {STAGES.map((name, i) => (
        <View
          key={name}
          style={[
            styles.segment,
            { backgroundColor: i < stage ? colors.blueBorder : i === stage ? colors.blue : colors.segmentEmpty },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 6, borderRadius: 3 },
});
