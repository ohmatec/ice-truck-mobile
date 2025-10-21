// app/details.tsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import TruckFromSvg from "../components/TruckSVG";
import {
  getTrucks,
  subscribe,
  updateTruck,
  addHistory,
  getHistory,
  subscribeHistory,
  Truck,
  HistoryItem as HItem,
} from "../services/store";

const STEP = 100;

export default function DetailsScreen() {
  const { tid } = useLocalSearchParams<{ tid: string }>();
  const router = useRouter();

  const [trucks, setTrucks] = useState<Truck[]>(getTrucks());
  useEffect(() => {
    const unsub = subscribe(setTrucks);
    return unsub;
  }, []);

  const truck = useMemo(() => trucks.find((t) => t.id === tid), [trucks, tid]);

  // history ต่อคัน
  const [history, setHistory] = useState<HItem[]>(getHistory(tid || ""));
  useEffect(() => {
    if (!tid) return;
    const unsub = subscribeHistory(tid, setHistory);
    return unsub;
  }, [tid]);

  // Live position สำหรับคันนี้
  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    (async () => {
      if (!tid) return;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        addHistory(tid, {
          title: "Live position",
          location: "Permission denied",
          desc: "Location permission was not granted.",
          highlight: false,
          timeISO: new Date().toISOString(),
        });
        return;
      }
      sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 0,
          timeInterval: 10000,
        },
        async (pos) => {
          try {
            const rev = await Location.reverseGeocodeAsync({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            const first = rev[0];
            const city = first?.city || first?.subregion || "Unknown City";
            const country = first?.country || "";
            addHistory(tid, {
              title: "Live position",
              location: `${city}, ${country}`,
              desc: `Lat ${pos.coords.latitude.toFixed(5)}, Lng ${pos.coords.longitude.toFixed(5)}`,
              highlight: true,
              timeISO: new Date().toISOString(),
            });
          } catch {
            addHistory(tid, {
              title: "Live position",
              location: "—",
              desc: "Updating…",
              highlight: true,
              timeISO: new Date().toISOString(),
            });
          }
        }
      );
    })();
    return () => sub?.remove();
  }, [tid]);

  if (!truck) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Truck not found.</Text>
        <Pressable onPress={() => router.replace("/")}>
          <Text style={{ color: "#3BA0FF", marginTop: 8 }}>Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const safeMaxKg = truck.maxKg > 0 ? truck.maxKg : 1;
  const spacePct = Math.max(
    0,
    Math.min(100, Math.floor((truck.weightKg / safeMaxKg) * 100))
  );

  function adjust(delta: number) {
  if (!truck) return; // ← กันกรณี undefined ให้ TS รับรองว่า truck มีค่า
  const next = Math.max(0, Math.min(truck.maxKg, truck.weightKg + delta));
  updateTruck(truck.id, { weightKg: next });
}


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F8FB" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={D.h1}>{truck.name}</Text>

        <TruckFromSvg fillPct={spacePct} height={120} />

        {/* Truck Info */}
        <View style={D.infoHead}>
          <Text style={D.title}>Truck Information</Text>
          <Pressable onPress={() => updateTruck(truck.id, { weightKg: 0 })}>
            <Text style={D.reset}>Reset Code</Text>
          </Pressable>
        </View>

        <View style={D.row}>
          <Pressable
            style={[D.btn, { backgroundColor: "#EDF4FF" }]}
            onPress={() => adjust(-STEP)}
          >
            <Text style={[D.btnTxt, { color: "#000" }]}>- {STEP}</Text>
          </Pressable>
          <Pressable
            style={[D.btn, { backgroundColor: "#3BA0FF" }]}
            onPress={() => adjust(+STEP)}
          >
            <Text style={[D.btnTxt, { color: "#fff" }]}>+ {STEP}</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 6 }}>
          <View style={D.metaRow}>
            <Text style={D.metaLeft}>Space Capacity (%)</Text>
            <Text style={D.metaRight}>/100%</Text>
          </View>
          <View style={D.track}>
            <View style={[D.fill, { width: `${spacePct}%` }]} />
          </View>
          <Text style={D.pct}>{spacePct}%</Text>
        </View>

        {/* Specs */}
        <View style={D.grid}>
          <SpecRow
            leftLabel="Type"
            leftValue="Hino Telolet"
            rightLabel="Weight (KG)"
            rightValue={fmt(truck.weightKg)}
          />
          <SpecRow
            leftLabel="Max Speed (KM/H)"
            leftValue="108"
            rightLabel="Max Power (PS)"
            rightValue="256"
          />
          <SpecRow
            leftLabel="Tank Capacity (L)"
            leftValue="200"
            rightLabel="Tire Size"
            rightValue="10.00–20–16PR"
          />
        </View>

        {/* Tracking per truck */}
        <Text style={[D.title, { marginTop: 16 }]}>Tracking History</Text>
        {history.map((h) => (
          <HistoryCard key={h.id} item={h} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function SpecRow(p: {
  leftLabel: string;
  leftValue: string | number;
  rightLabel: string;
  rightValue: string | number;
}) {
  return (
    <View style={D.rowSpec}>
      <View style={D.cell}>
        <Text style={D.kLabel}>{p.leftLabel}</Text>
        <Text style={D.kValue}>{String(p.leftValue)}</Text>
      </View>
      <View style={[D.cell, D.cellDivider]}>
        <Text style={D.kLabel}>{p.rightLabel}</Text>
        <Text style={D.kValue}>{String(p.rightValue)}</Text>
      </View>
    </View>
  );
}

function HistoryCard({ item }: { item: HItem }) {
  return (
    <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
      <View style={{ alignItems: "center" }}>
        <View
          style={[HI.bullet, item.highlight && { backgroundColor: "#3BA0FF" }]}
        >
          <MaterialCommunityIcons name="truck" size={14} color="#fff" />
        </View>
        <View style={HI.dash} />
      </View>

      <View style={HI.card}>
        <View style={HI.rowHead}>
          <Text style={HI.title}>{item.title}</Text>
          <View style={HI.iconRow}>
            <Ionicons name="call-outline" size={18} color="#8A97A8" />
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color="#8A97A8"
            />
          </View>
        </View>
        <Text style={HI.time}>{new Date(item.timeISO).toLocaleString()}</Text>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
        >
          <Ionicons name="location" size={16} color="#3BA0FF" />
          <Text style={[HI.loc, { marginLeft: 6 }]}>{item.location}</Text>
        </View>
        <Text style={HI.desc}>{item.desc}</Text>
      </View>
    </View>
  );
}

const D = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: "800", color: "#1F2A37" },
  title: { fontSize: 16, fontWeight: "800", color: "#1F2A37" },
  reset: { color: "#FF6E7A", fontWeight: "700" },
  infoHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  row: { flexDirection: "row", gap: 10, marginTop: 16, marginBottom: 12 },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnTxt: { fontWeight: "700" },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  metaLeft: { color: "#8A97A8", fontSize: 12 },
  metaRight: { color: "#C0C7D3", fontSize: 12 },
  track: {
    height: 4,
    backgroundColor: "#E8EEF5",
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 4,
  },
  fill: { height: "100%", backgroundColor: "#3BA0FF" },
  pct: { marginTop: 6, color: "#3BA0FF", fontWeight: "800", fontSize: 18 },
  grid: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E8EEF5",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEF5",
  },
  rowSpec: { flexDirection: "row", paddingVertical: 10 },
  cell: { flex: 1, paddingRight: 12 },
  cellDivider: {
    borderLeftWidth: 1,
    borderLeftColor: "#E8EEF5",
    paddingLeft: 12,
  },
  kLabel: { color: "#8A97A8", fontSize: 12, marginBottom: 4 },
  kValue: { color: "#1F2A37", fontWeight: "700" },
});

const HI = StyleSheet.create({
  bullet: {
    width: 22,
    height: 22,
    borderRadius: 22,
    backgroundColor: "#9DB4C7",
    alignItems: "center",
    justifyContent: "center",
  },
  dash: {
    width: 2,
    flex: 1,
    borderStyle: "dashed",
    borderLeftWidth: 2,
    borderColor: "#E8EEF5",
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E8EEF5",
    padding: 12,
  },
  rowHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#1F2A37", fontWeight: "800" },
  iconRow: { flexDirection: "row", gap: 10 },
  time: { color: "#8A97A8", marginTop: 2, fontSize: 12 },
  loc: { color: "#1F2A37", fontWeight: "800" },
  desc: { color: "#8A97A8", marginTop: 6, fontSize: 12 },
});

function fmt(n: number) {
  return new Intl.NumberFormat().format(n);
}
