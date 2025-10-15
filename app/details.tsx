import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

/** -------- Mock service ในไฟล์เดียว -------- */
type Truck = { id: string; name: string; temp: number; updatedAt: string };

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function fetchTruckDetail(id: string): Promise<Truck> {
  await delay(400);
  return { id, name: `Truck ${id.slice(-1)}`, temp: -18.0, updatedAt: new Date().toISOString() };
}
/** ------------------------------------------ */

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "success"; data: Truck }
  >({ status: "loading" });

  useEffect(() => {
    if (!id) {
      setState({ status: "error", message: "Missing id" });
      return;
    }
    (async () => {
      try {
        const d = await fetchTruckDetail(String(id));
        setState({ status: "success", data: d });
      } catch (e: any) {
        setState({ status: "error", message: e?.message ?? "UNKNOWN" });
      }
    })();
  }, [id]);

  return (
    <View style={S.screen}>
      {/* Header ง่าย ๆ */}
      <View style={{ marginBottom: 16, flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={S.title}>Detail</Text>
        <Pressable onPress={() => router.back()} style={S.btn}>
          <Text style={S.btnText}>Back</Text>
        </Pressable>
      </View>

      {state.status === "loading" && <Text style={S.muted}>Loading...</Text>}
      {state.status === "error" && <Text style={{ color: "#FF5A7A" }}>Error: {state.message}</Text>}

      {state.status === "success" && (
        <View style={{ gap: 10 }}>
          <Text style={S.line}>ID: {state.data.id}</Text>
          <Text style={S.line}>Name: {state.data.name}</Text>
          <Text style={S.line}>Temp: {state.data.temp} °C</Text>
          <Text style={S.muted}>Updated: {new Date(state.data.updatedAt).toLocaleString()}</Text>
        </View>
      )}
    </View>
  );
}

const S = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0B0F14", paddingHorizontal: 16, paddingTop: 18 },
  title: { fontSize: 20, fontWeight: "700", color: "#E6F2FF" },
  muted: { color: "#98A6B3" },
  line: { color: "#E6F2FF", fontSize: 16, fontWeight: "600" },
  btn: {
    backgroundColor: "#4FB2FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  btnText: { color: "#0B0F14", fontWeight: "700" },
});
