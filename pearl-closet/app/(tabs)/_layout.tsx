import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { useTheme } from '@/components/ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName; iconActive: IconName }[] = [
  { name: 'index', title: 'Início', icon: 'home-outline', iconActive: 'home' },
  { name: 'closet', title: 'Closet', icon: 'shirt-outline', iconActive: 'shirt' },
  { name: 'looks', title: 'Looks', icon: 'sparkles-outline', iconActive: 'sparkles' },
  { name: 'chat', title: 'Chat', icon: 'chatbubbles-outline', iconActive: 'chatbubbles' },
  { name: 'favorites', title: 'Favoritos', icon: 'heart-outline', iconActive: 'heart' },
];

export default function TabLayout() {
  const { c, f } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: { backgroundColor: c.card, borderTopColor: c.border },
        tabBarLabelStyle: { fontFamily: f.bold, fontSize: 11 },
        sceneStyle: { backgroundColor: c.bg },
      }}>
      {TABS.map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            title: t.title,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? t.iconActive : t.icon} size={24} color={color as string} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
