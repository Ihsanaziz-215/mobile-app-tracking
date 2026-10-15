import { Flag, ListChecks, Ship, User } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useOrders } from '@/data/store';
import { colors, fontFamily } from '@/lib/theme';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { orders } = useOrders();
  const followUps = orders.filter((o) => o.followUp && !o.followUp.chosenOptionId).length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fontFamily.medium, fontSize: 12 },
        tabBarStyle: {
          height: 64 + insets.bottom,
          paddingTop: 8,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          backgroundColor: colors.white,
        },
        tabBarBadgeStyle: {
          backgroundColor: colors.orange,
          color: colors.ink,
          fontFamily: fontFamily.bold,
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Items', tabBarIcon: ({ color }) => <ListChecks size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="follow-up"
        options={{
          title: 'Follow-up',
          tabBarBadge: followUps || undefined,
          tabBarIcon: ({ color }) => <Flag size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vessels"
        options={{ title: 'Vessels', tabBarIcon: ({ color }) => <Ship size={24} color={color} /> }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Account', tabBarIcon: ({ color }) => <User size={24} color={color} /> }}
      />
    </Tabs>
  );
}
