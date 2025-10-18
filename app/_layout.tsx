// app/_layout.tsx
import React from "react";
import { Stack, Redirect, usePathname } from "expo-router";

// ✅ ค่าระดับโมดูล: ใช้กัน redirect ซ้ำใน session เดียว
let didRedirectOnce = false;

export default function RootLayout() {
  const pathname = usePathname();

  // ✅ พาไป onboarding แค่ "ครั้งแรก" ตอนเปิดแอป และเฉพาะเมื่อเริ่มที่ "/"
  if (!didRedirectOnce && pathname === "/") {
    didRedirectOnce = true;           // ทำครั้งเดียวต่อ session
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="details" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}
