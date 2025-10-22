// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// กันแอปซ่อนสแปลชเร็วเกินไป (option)
// คุณสามารถลบ useEffect นี้ได้หากไม่ได้ใช้ asset preload
export default function RootLayout() {
  useEffect(() => {
    // ปล่อย splash อัตโนมัติถ้าไม่มีงาน preload
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#121821' },
        headerTintColor: '#E6EDF3',
        headerTitleStyle: { fontWeight: '700' },
        contentStyle: { backgroundColor: '#0B0F14' },
        animation: Platform.select({ android: 'fade_from_bottom', ios: 'default' }),
      }}
    />
  );
}
