// app/index.tsx
import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, RefreshControl, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

/** ---------- Entry: เช็ค onboarding แล้วค่อยเรนเดอร์ Home ---------- */
export default function Entry() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const seen = (await AsyncStorage.getItem("seenOnboarding")) === "1";
        if (!seen) {
          router.replace("/onboarding"); // 👉 ไปหน้า onboarding ครั้งแรก
          return;
        }
      } finally {
        setReady(true); // พร้อมเรนเดอร์ Home
      }
    })();
  }, [router]);

  if (!ready) {
    // 👉 แสดง Loader ป้องกันจอขาว (อย่า return null)
    return (
      <View style={S.center}>
        <ActivityIndicator />
        <Text style={{ color: "#666", marginTop: 8 }}>Loading…</Text>
      </View>
    );
  }

  return <HomeScreen />; // ✅ เคยเห็นแล้ว → เข้าบ้านได้
}
/** ------------------------------------------------------------------- */


/** -------- Mock service แบบเบา ๆ ในไฟล์เดียว (คงตามที่คุณให้มา) -------- */
type Truck = { id: string; name: string; temp: number; updatedAt: string };

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchTrucks(): Promise<Truck[]> {
  await delay(500);
  // สุ่ม error เล็กน้อยเพื่อเทส UI
  if (Math.random() < 1 / 6) throw new Error("NETWORK_ERROR");
  // สุ่ม empty นิดหน่อย
  if (Math.random() < 1 / 12) return [];
  const now = new Date().toISOString();
  return [
    { id: "T-001", name: "Truck A", temp: -18.2, updatedAt: now },
    { id: "T-002", name: "Truck B", temp: -17.6, updatedAt: now },
    { id: "T-003", name: "Truck C", temp: -19.1, updatedAt: now },
  ];
}
/** --------------------------------------------------------------------- */


/** ----------------------------- HomeScreen ---------------------------- */
function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<Truck[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetchTrucks();
      setData(res);
    } catch (e: any) {
      setError(e?.message ?? "UNKNOWN");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await fetchTrucks();
      setData(res);
      setError(null);
    } catch (e: any) {
      setError(e?.message ?? "UNKNOWN");
    } finally {
      setRefreshing(false);
    }
  }, []);

  return (
    <View style={S.screen}>
      <Text style={S.title} accessibilityRole="header">
        Ice Truck
      </Text>
      <Text style={S.subtitle}>Realtime (mock)</Text>

      {error ? (
        <View style={{ marginTop: 12, marginBottom: 8 }}>
          <Text style={{ color: "#FF5A7A", marginBottom: 8 }}>Error: {error}</Text>
          <Pressable onPress={load} style={S.btn}>
            <Text style={S.btnText}>Try again</Text>
          </Pressable>
        </View>
      ) : null}

      {!loading && data.length === 0 ? (
        <View style={{ marginTop: 16 }}>
          <Text style={{ color: "#98A6B3", marginBottom: 8 }}>No data available.</Text>
          <Pressable onPress={load} style={S.btn}>
            <Text style={S.btnText}>Reload</Text>
          </Pressable>
        </View>
      ) : null}

      <FlatList
        data={data}
        keyExtractor={(it) => it.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4FB2FF" />}
        contentContainerStyle={{ paddingVertical: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.name}`}
            onPress={() => router.push({ pathname: "/details", params: { id: item.id } })}
            style={({ pressed }) => [S.card, pressed && { opacity: 0.95, transform: [{ scale: 0.997 }] }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={S.cardTitle}>
                {item.name} · {item.temp}°C
              </Text>
              <Text style={S.cardSub}>Updated: {new Date(item.updatedAt).toLocaleTimeString()}</Text>
            </View>
            <Text style={{ color: "#98A6B3", fontWeight: "600" }}>{item.id}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
/** --------------------------------------------------------------------- */


/** -------------------------------- Styles ----------------------------- */
const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B0F14", paddingHorizontal: 16, paddingTop: 18 },
  title: { fontSize: 20, fontWeight: "700", color: "#E6F2FF" },
  subtitle: { fontSize: 14, color: "#98A6B3", marginTop: 4 },
  card: {
    backgroundColor: "#121821",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1E2630",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardTitle: { color: "#E6F2FF", fontSize: 16, fontWeight: "700" },
  cardSub: { color: "#98A6B3", marginTop: 6 },
  btn: {
    backgroundColor: "#4FB2FF",
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  btnText: { color: "#0B0F14", fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "white" },
});
