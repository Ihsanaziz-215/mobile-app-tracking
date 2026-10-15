import { MessageSquare, Phone } from 'lucide-react-native';
import { Linking, StyleSheet, View } from 'react-native';

import type { Contact } from '@/data/types';
import { colors } from '@/lib/theme';
import { AppText } from './AppText';
import { PressableScale } from './PressableScale';
import { useToast } from './Toast';

function IconButton({ label, onPress, children }: { label: string; onPress: () => void; children: React.ReactNode }) {
  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={label} style={styles.iconButton}>
      {children}
    </PressableScale>
  );
}

export function ContactRow({ contact }: { contact: Contact }) {
  const toast = useToast();
  const open = (url: string) =>
    Linking.openURL(url).catch(() => toast.error('Unable to open', 'This device cannot handle that action'));

  const withPhone = (action: (digits: string) => void) => () => {
    if (!contact.phone) {
      toast.info('No phone number', `${contact.name} has no phone number on file yet`);
      return;
    }
    action(contact.phone);
  };

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <AppText size={15} weight="semibold">
          {contact.name.charAt(0).toUpperCase()}
        </AppText>
      </View>
      <View style={styles.info}>
        <AppText size={15} weight="semibold">
          {contact.name}
        </AppText>
        <AppText size={14} color={colors.muted}>
          {contact.role}
        </AppText>
      </View>
      <IconButton
        label={`Message ${contact.name}`}
        onPress={withPhone((phone) => open(`https://wa.me/${phone.replace(/\D/g, '')}`))}
      >
        <MessageSquare size={20} color={colors.ink} />
      </IconButton>
      <IconButton label={`Call ${contact.name}`} onPress={withPhone((phone) => open(`tel:${phone}`))}>
        <Phone size={20} color={colors.ink} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  info: { flex: 1 },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
});
