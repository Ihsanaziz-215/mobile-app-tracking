import Constants from 'expo-constants';
import { LogOut, RefreshCw } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, InfoRow, SectionLabel, SwitchRow } from '@/components/AccountRows';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';
import { ACCOUNT, NOTIFICATION_PREFS } from '@/data/account';
import { useOrders } from '@/data/store';
import { colors } from '@/lib/theme';
import { useSync } from '@/lib/useSync';

const initials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

function Stat({ value, label, tone }: { value: number; label: string; tone?: string }) {
  return (
    <View style={styles.stat}>
      <AppText size={22} weight="bold" color={tone ?? colors.ink}>
        {value}
      </AppText>
      <AppText size={13} color={colors.muted}>
        {label}
      </AppText>
    </View>
  );
}

export default function Account() {
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const sync = useSync();
  const { orders } = useOrders();
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIFICATION_PREFS.map((p) => [p.key, p.defaultOn])),
  );

  const atRisk = orders.filter((o) => o.risk === 'at-risk').length;
  const pending = orders.filter((o) => o.followUp && !o.followUp.chosenOptionId).length;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <AppText size={21} weight="semibold">
          Account
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <AppText size={20} weight="semibold">
              {initials(ACCOUNT.name)}
            </AppText>
          </View>
          <View style={styles.profileText}>
            <AppText size={18} weight="semibold">
              {ACCOUNT.name}
            </AppText>
            <AppText size={14} color={colors.muted}>
              {ACCOUNT.role}, {ACCOUNT.company}
            </AppText>
          </View>
        </View>

        <Card>
          <View style={styles.stats}>
            <Stat value={orders.length} label="Active POs" />
            <View style={styles.statDivider} />
            <Stat value={atRisk} label="At risk" tone={atRisk > 0 ? colors.redStrong : undefined} />
            <View style={styles.statDivider} />
            <Stat value={pending} label="To follow up" />
          </View>
        </Card>

        <View style={styles.section}>
          <SectionLabel>Details</SectionLabel>
          <Card>
            <InfoRow label="Email" value={ACCOUNT.email} />
            <InfoRow label="Phone" value={ACCOUNT.phone} />
            <InfoRow label="Site" value={ACCOUNT.site} />
            <InfoRow label="Role" value={ACCOUNT.role} last />
          </Card>
        </View>

        <View style={styles.section}>
          <SectionLabel>Notifications</SectionLabel>
          <Card>
            {NOTIFICATION_PREFS.map((pref, i) => (
              <SwitchRow
                key={pref.key}
                label={pref.label}
                hint={pref.hint}
                value={prefs[pref.key]}
                onChange={(next) => setPrefs((p) => ({ ...p, [pref.key]: next }))}
                last={i === NOTIFICATION_PREFS.length - 1}
              />
            ))}
          </Card>
        </View>

        <View style={styles.section}>
          <SectionLabel>Odoo</SectionLabel>
          <Card>
            <InfoRow label="Connected as" value={ACCOUNT.odooUser} />
            <InfoRow label="Last synced" value={ACCOUNT.lastSynced} last />
          </Card>
          <Button
            label="Sync now"
            variant="outline"
            icon={<RefreshCw size={17} color={colors.ink} />}
            onPress={sync}
            style={styles.syncButton}
          />
        </View>

        <Button
          label="Sign out"
          variant="outline"
          icon={<LogOut size={17} color={colors.redStrong} />}
          onPress={() => toast.info('Sign out unavailable', 'This is a demo account with no login yet')}
          style={styles.signOut}
        />

        <AppText size={13} color={colors.muted} style={styles.version}>
          Abel PO Tracker v{Constants.expoConfig?.version ?? '1.0.0'}
        </AppText>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.white },
  header: {
    height: 64,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  content: { padding: 16, paddingBottom: 32, gap: 16 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  profileText: { flex: 1, gap: 2 },
  stats: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statDivider: { width: 1, height: 36, backgroundColor: colors.borderSoft },
  section: { marginTop: 8 },
  syncButton: { marginTop: 12, height: 48 },
  signOut: { marginTop: 8 },
  version: { textAlign: 'center' },
});
