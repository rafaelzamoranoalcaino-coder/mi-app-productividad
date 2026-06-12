import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as Haptics from 'expo-haptics';
import { useTema } from '../contexto-tema';

function TabButton({ acentoColor, ...props }: BottomTabBarButtonProps & { acentoColor: string }) {
  const isActive = props.accessibilityState?.selected;
  return (
    <Pressable
      onPress={props.onPress}
      onLongPress={props.onLongPress}
      style={[styles.btn, isActive && { backgroundColor: acentoColor + '40' }]}
      onPressIn={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      {props.children}
    </Pressable>
  );
}

export default function TabLayout() {
  const { paleta } = useTema();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <TabButton {...props} acentoColor={paleta.acento} />,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: paleta.textoMuted,
        tabBarStyle: {
          backgroundColor: paleta.header,
          borderTopWidth: 0,
          height: 80,
          paddingHorizontal: 6,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: styles.label,
      }}>
      <Tabs.Screen
        name="calendario"
        options={{
          title: 'Cal',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="diarias"
        options={{
          title: 'Dia',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="checkmark.circle.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tareas"
        options={{
          title: 'Tar',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="list.bullet" color={color} />,
        }}
      />
      <Tabs.Screen
        name="recordatorios"
        options={{
          title: 'Rec',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="bell.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="configuracion"
        options={{
          title: 'Cfg',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginHorizontal: 3,
    marginVertical: 6,
  },
});