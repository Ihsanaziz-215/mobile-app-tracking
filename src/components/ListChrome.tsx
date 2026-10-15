import { RefreshCw, Search, X } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { hapticSelect } from '@/lib/haptics';
import { useSync } from '@/lib/useSync';
import { colors, fontFamily } from '@/lib/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';

export function ListHeader({ title }: { title: string }) {
  const sync = useSync();

  return (
    <View style={styles.header}>
      <AppText size={21} weight="semibold">
        {title}
      </AppText>
      <PressableScale onPress={sync} style={styles.sync} accessibilityRole="button">
        <RefreshCw size={15} color={colors.navy} />
        <AppText size={13} weight="semibold" color={colors.navy}>
          Sync with Odoo
        </AppText>
      </PressableScale>
    </View>
  );
}

interface SearchFieldProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function SearchField({ value, onChange, placeholder = 'search po number' }: SearchFieldProps) {
  return (
    <View style={styles.searchWrap}>
      <View style={styles.search}>
        <Search size={18} color={colors.muted} />
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          style={styles.input}
        />
        {value.length > 0 && (
          <Pressable onPress={() => onChange('')} hitSlop={10} accessibilityLabel="Clear search">
            <X size={18} color={colors.muted} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

interface FilterChipsProps<K extends string> {
  options: { key: K; label: string; count: number }[];
  value: K;
  onChange: (key: K) => void;
}

export function FilterChips<K extends string>({ options, value, onChange }: FilterChipsProps<K>) {
  return (
    <View style={styles.chipsWrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {options.map((o) => {
          const active = o.key === value;
          return (
            <PressableScale
              key={o.key}
              onPress={() => {
                if (!active) hapticSelect();
                onChange(o.key);
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Animated.View
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.navy : colors.white,
                    borderColor: active ? colors.navy : colors.border,
                    transitionProperty: ['backgroundColor', 'borderColor'],
                    transitionDuration: 160,
                    transitionTimingFunction: 'ease-out',
                  },
                ]}
              >
                <Animated.Text
                  style={{
                    fontFamily: fontFamily.medium,
                    fontSize: 15,
                    color: active ? colors.white : colors.ink,
                    transitionProperty: 'color',
                    transitionDuration: 160,
                    transitionTimingFunction: 'ease-out',
                  }}
                >
                  {o.label} {o.count}
                </Animated.Text>
              </Animated.View>
            </PressableScale>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  sync: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.blueBorder,
    backgroundColor: colors.blueSoft,
  },
  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: { flex: 1, fontFamily: fontFamily.regular, fontSize: 15, color: colors.ink, padding: 0 },
  chipsWrap: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  chips: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  chip: {
    height: 44,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
});
