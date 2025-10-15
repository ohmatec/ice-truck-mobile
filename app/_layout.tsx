import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, Redirect, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "seenOnboarding";

export default function RootLayout() {
  const pathname = usePathname();
  const [ready, setReady] = React.useState(false);
  const [seen, setSeen] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        setSeen((await AsyncStorage.getItem(KEY)) === "1");
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready || seen === null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!seen && pathname !== "/onboarding") {
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
