// app/index.tsx
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import TruckFromSvg from "../components/TruckSVG";

const MAX_KG = 12000;
const STEP = 100;

export default function IndexScreen() {
  const [weightKg, setWeightKg] = useState(7282);
  const spacePct = Math.floor((weightKg / MAX_KG) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F8FB" }}>
      <StatusBar style="dark" />
      <View style={S.container}>
        <Text style={S.h1}>Your Truck</Text>

        <TruckFromSvg fillPct={spacePct} height={120} />

        <View style={{ marginTop: 16 }}>
          <Text style={S.label}>Space Capacity</Text>
          <Text style={S.big}>{spacePct}%</Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Text style={S.label}>Weight (KG)</Text>
          <Text style={S.big}>{new Intl.NumberFormat().format(weightKg)}</Text>
        </View>

        <View style={S.row}>
          <Pressable style={[S.btn, { backgroundColor: "#EDF4FF" }]}
            onPress={() => setWeightKg(Math.max(0, weightKg - STEP))}>
            <Text style={[S.btnTxt, { color: "#000000ff" }]}>- {STEP}</Text>
          </Pressable>
          <Pressable style={[S.btn, { backgroundColor: "#3BA0FF" }]}
            onPress={() => setWeightKg(Math.min(MAX_KG, weightKg + STEP))}>
            <Text style={[S.btnTxt, { color: "#fff" }]}>+ {STEP}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 10 },
  h1: { fontSize: 20, fontWeight: "700", color: "#0D1B2A", marginBottom: 8 },
  label: { color: "#7C8AA0" },
  big: { color: "#0D1B2A", fontSize: 22, fontWeight: "800" },
  row: { flexDirection: "row", gap: 10, marginTop: 14 },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  btnTxt: { fontWeight: "700" },
});
