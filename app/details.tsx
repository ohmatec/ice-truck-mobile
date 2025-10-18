import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const BLUE = "#58B0FF";
const TXT = "#0D1B2A";
const MUTED = "#7C8AA0";
const CARD = "#FFFFFF";
const BORDER = "#E6ECF3";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BLUE }}>
      <StatusBar style="light" backgroundColor={BLUE} />
      <View style={{ flex: 1, backgroundColor: "#F6F8FB" }}>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 28 }}>
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
            <Pressable onPress={() => router.back()} style={{ padding: 6, marginRight: 8 }}>
              <Ionicons name="arrow-back" size={22} color={TXT} />
            </Pressable>
            <Text style={{ color: TXT, fontSize: 18, fontWeight: "700" }}>Tracking Detail</Text>
          </View>

          {/* Shipping/Event tag */}
          <View style={{ backgroundColor: BLUE, borderRadius: 12, padding: 12, alignSelf: "flex-start" }}>
            <Text style={{ color: "#fff", fontWeight: "700" }}>Event ID</Text>
            <Text style={{ color: "#EAF5FF" }}>{id ?? "-"}</Text>
          </View>

          {/* Summary */}
          <View style={[styles.card, { marginTop: 12 }]}>
            <Text style={styles.title}>Summary</Text>
            <View style={{ marginTop: 8, gap: 6 }}>
              <Row label="Current Status" value="In transit" />
              <Row label="Last Update" value={new Date().toLocaleString()} />
              <Row label="Location" value="DKI Jakarta, Indonesia" />
            </View>
          </View>

          {/* Timeline */}
          <Text style={[styles.title, { marginTop: 18 }]}>Timeline</Text>
          <View style={{ marginTop: 8, gap: 14 }}>
            {[
              { t: "Order Received", l: "Warehouse, Jakarta", d: "Package received by carrier." },
              { t: "Departure", l: "Tanjung Priok, Indonesia", d: "Departed origin facility." },
              { t: "In Transit", l: "Bekasi, Indonesia", d: "Moving to destination city." },
            ].map((it, idx) => (
              <View key={idx} style={styles.historyRow}>
                <View style={styles.timelineCol}>
                  <View style={[styles.bullet, idx === 0 && { backgroundColor: BLUE }]}>
                    <MaterialCommunityIcons name="truck" size={14} color="#fff" />
                  </View>
                  <View style={styles.timeline} />
                </View>
                <View style={styles.historyCard}>
                  <Text style={styles.historyTitle}>{it.t}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
                    <Ionicons name="location" size={16} color={BLUE} />
                    <Text style={[styles.location, { marginLeft: 6 }]}>{it.l}</Text>
                  </View>
                  <Text style={styles.desc}>{it.d}</Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ color: MUTED }}>{label}</Text>
      <Text style={{ color: TXT, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: CARD, borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 12 },
  title: { color: TXT, fontSize: 16, fontWeight: "700" },

  historyRow: { flexDirection: "row", gap: 10 },
  timelineCol: { alignItems: "center" },
  bullet: { width: 22, height: 22, borderRadius: 22, backgroundColor: "#9DB4C7", alignItems: "center", justifyContent: "center" },
  timeline: { width: 2, flex: 1, backgroundColor: BORDER, marginTop: 6, marginBottom: 6 },

  historyCard: { flex: 1, backgroundColor: CARD, borderRadius: 16, borderWidth: 1, borderColor: BORDER, padding: 12 },
  historyTitle: { color: TXT, fontWeight: "700" },
  location: { color: TXT, fontWeight: "700" },
  desc: { color: MUTED, marginTop: 6 },
});
