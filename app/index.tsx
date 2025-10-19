// app/index.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import TruckFromSvg from "../components/TruckSVG"; // ← ใช้ชื่อไฟล์/คอมโพเนนต์ของคุณ

const MAX_KG = 12000;
const STEP = 100;

export default function IndexScreen() {
  const [weightKg, setWeightKg] = useState(7282);
  const spacePct = Math.max(
    0,
    Math.min(100, Math.floor((weightKg / MAX_KG) * 100))
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F8FB" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={S.container}>
        <Text style={S.h1}>Your Truck</Text>

        {/* --- Truck (ไม่เปลี่ยนโมเดล) --- */}
        <TruckFromSvg fillPct={spacePct} height={120} />

        {/* ===== Truck Information ===== */}
        <View style={TI.wrap}>
          <View style={TI.header}>
            <Text style={TI.title}>Truck Information</Text>
            <Pressable
              style={TI.resetRow}
              onPress={() => setWeightKg(0)}
              accessibilityRole="button"
            >
              <Text style={TI.resetText}>Reset Code</Text>
              <Ionicons name="alert-circle-outline" size={14} color="#FF6E7A" />
            </Pressable>
          </View>
          {/* ปุ่ม +/– เดิม (ไว้เทส spacePct/weight) */}
        <View style={S.row}>
          <Pressable
            style={[S.btn]}
            onPress={() => setWeightKg(Math.max(0, weightKg - STEP))}
          >

            <Text style={[S.btnTxt, { color: "#000" }]}>- {STEP}</Text>
          </Pressable>
          <Pressable
            style={[S.btn, { backgroundColor: "#3BA0FF" }]}
            onPress={() => setWeightKg(Math.min(MAX_KG, weightKg + STEP))}
          >
            <Text style={[S.btnTxt, { color: "#fff" }]}>+ {STEP}</Text>
          </Pressable>
        </View>

          {/* Space Capacity */}
          <View style={{ marginTop: 4 }}>
            <View style={TI.metaRow}>
              <Text style={TI.metaLeft}>Space Capacity (%)</Text>
              <Text style={TI.metaRight}>/100%</Text>
            </View>
            <View style={TI.track}>
              <View style={[TI.fill, { width: `${spacePct}%` }]} />
            </View>
            <Text style={TI.pct}>{spacePct}%</Text>
          </View>

          {/* Spec grid 2 คอลัมน์ */}
          <View style={TI.grid}>
            <SpecRow
              leftLabel="Type"
              leftValue="Hino Telolet"
              rightLabel="Weight (KG)"
              rightValue={fmt(weightKg)}
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
        </View>

        {/* ===== Tracking History ===== */}
        <Text style={[TI.title, { marginTop: 16 }]}>Tracking History</Text>

        <HistoryItem
          title="Order Received"
          time="Oct 13, 22 18:05 GMT+07"
          location="DKI Jakarta, Indonesia"
          desc="your package is currently on its way in the city of jakarta"
          highlight
        />

        <HistoryItem
          title="Departure"
          time="Oct 13, 22 18:05 GMT+07"
          location="Tanjung Priok, Indonesia"
          desc="your package is currently on its way in the city of jakarta"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== Helper Components ===== */
function SpecRow(p: {
  leftLabel: string;
  leftValue: string | number;
  rightLabel: string;
  rightValue: string | number;
}) {
  return (
    <View style={TI.row}>
      <View style={TI.cell}>
        <Text style={TI.kLabel}>{p.leftLabel}</Text>
        <Text style={TI.kValue}>{String(p.leftValue)}</Text>
      </View>
      <View style={[TI.cell, TI.cellDivider]}>
        <Text style={TI.kLabel}>{p.rightLabel}</Text>
        <Text style={TI.kValue}>{String(p.rightValue)}</Text>
      </View>
    </View>
  );
}

function HistoryItem({
  title,
  time,
  location,
  desc,
  highlight,
}: {
  title: string;
  time: string;
  location: string;
  desc: string;
  highlight?: boolean;
}) {
  return (
    <View style={{ flexDirection: "row", gap: 10, marginTop: 14 }}>
      {/* timeline (ไอคอน + เส้นประ) */}
      <View style={{ alignItems: "center" }}>
        <View style={[HI.bullet, highlight && { backgroundColor: "#3BA0FF" }]}>
          <MaterialCommunityIcons name="truck" size={14} color="#fff" />
        </View>
        <View style={HI.dash} />
      </View>

      {/* card */}
      <View style={HI.card}>
        <View style={HI.rowHead}>
          <Text style={HI.title}>{title}</Text>
          <View style={HI.iconRow}>
            <Ionicons name="call-outline" size={18} color="#8A97A8" />
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={18}
              color="#8A97A8"
            />
          </View>
        </View>

        <Text style={HI.time}>{time}</Text>

        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
        >
          <Ionicons name="location" size={16} color="#3BA0FF" />
          <Text style={[HI.loc, { marginLeft: 6 }]}>{location}</Text>
        </View>
        <Text style={HI.desc}>{desc}</Text>

        <Pressable style={HI.cta}>
          <Text style={HI.ctaText}>See Detail</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

/* ===== Styles ===== */
const S = StyleSheet.create({
  container: { padding: 16, paddingBottom: 28, gap: 10 },
  h1: { fontSize: 20, fontWeight: "700", color: "#0D1B2A" },
  row: { flexDirection: "row", gap: 10, marginTop: 16, marginBottom: 28 },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnTxt: { fontWeight: "700" },
});

const TI = StyleSheet.create({
  wrap: { marginTop: 8 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: "#1F2A37", fontSize: 16, fontWeight: "800" },
  resetRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  resetText: { color: "#FF6E7A", fontWeight: "700" },

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
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#E8EEF5",
    borderBottomWidth: 1,
    borderBottomColor: "#E8EEF5",
  },
  row: { flexDirection: "row", paddingVertical: 10 },
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

  cta: {
    marginTop: 10,
    backgroundColor: "#3BA0FF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  ctaText: { color: "#fff", fontWeight: "800" },
});

function fmt(n: number) {
  return new Intl.NumberFormat().format(n);
}
