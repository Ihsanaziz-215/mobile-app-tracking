import { Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '@/lib/theme';
import { AppText } from './AppText';

export function AiSummaryCard({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.head}>
        <Sparkles size={15} color={colors.blue} />
        <AppText size={14} weight="semibold" color={colors.body}>
          AI summary
        </AppText>
      </View>
      <AppText size={15} numberOfLines={open ? undefined : 2}>
        {text}
      </AppText>
      <Pressable onPress={() => setOpen((v) => !v)} hitSlop={8} style={styles.more}>
        <AppText size={15} weight="semibold" color={colors.blue}>
          {open ? 'Show less' : 'Read more'}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 8, borderRadius: 12, backgroundColor: colors.surface },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  more: { alignSelf: 'flex-start', marginTop: 4 },
});
