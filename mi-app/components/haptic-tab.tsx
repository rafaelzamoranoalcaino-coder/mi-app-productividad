import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  const isActive = props.accessibilityState?.selected;

  return (
    <Pressable
      {...props}
      style={[styles.btn, isActive && styles.btnActivo]}
      onPressIn={(ev) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        props.onPressIn?.(ev);
      }}
    />
  );
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
    marginVertical: 8,
    paddingVertical: 6,
  },
  btnActivo: {
    backgroundColor: '#3D3A36',
  },
});