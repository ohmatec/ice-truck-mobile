import { View, Text, ScrollView, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Details() {
  const truck = {
    plate: "Hino Telolet",
    space: 60,
    type: "10.00–20 16PR",
    weight: 7282,
    speed: 108,
    power: 215,
    size: "The Six",
  };
  const timeline = [
    {
      when: "Oct 21, 23:05",
      title: "Order Received",
      place: "DKI, Jakarta, Indonesia",
    },
    {
      when: "Oct 21, 17:07",
      title: "Departure",
      place: "Tanjung Priok, Indonesia",
    },
  ];

  return (
    <ScrollView contentContainerStyle={s.wrap}>
      <StatusBar style="dark" />
      <View style={s.card}>
        <Text style={s.badge}>Your Truck Here!</Text>
        <Text style={s.h1}>Truck Information</Text>
        <View style={s.row}>
          <Item label="Space Capacity" value={`${truck.space}%`} />
          <Item label="Type" value={truck.type} />
        </View>
        <View style={s.row}>
          <Item label="Weight (kg)" value={truck.weight.toString()} />
          <Item label="Max Speed (km/h)" value={truck.speed.toString()} />
        </View>
        <View style={s.row}>
          <Item label="Max Power (PS)" value={truck.power.toString()} />
          <Item label="The Size" value={truck.size} />
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.h1}>Tracking History</Text>
        {timeline.map((x, i) => (
          <View key={i} style={s.timeline}>
            <View style={[s.dot, i === 0 && s.dotBlue]} />
            <View style={{ flex: 1 }}>
              <Text style={s.time}>{x.when}</Text>
              <Text style={s.title}>{x.title}</Text>
              <Text style={s.place}>{x.place}</Text>
            </View>
            <Text style={s.link}>See detail ›</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.item}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "#e7f1ff",
    color: "#356eb3",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 8,
    fontWeight: "700",
  },
  h1: { fontSize: 18, fontWeight: "800", color: "#1d3557", marginBottom: 10 },
  row: { flexDirection: "row", gap: 12 },
  item: { flex: 1, backgroundColor: "#f7f9fc", borderRadius: 12, padding: 12 },
  label: { fontSize: 12, color: "#6c7a89" },
  value: { fontSize: 16, fontWeight: "700", color: "#1d3557", marginTop: 4 },
  timeline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eef2f7",
  },
  dot: { width: 10, height: 10, borderRadius: 6, backgroundColor: "#cfd8e3" },
  dotBlue: { backgroundColor: "#2c5b86" },
  time: { fontSize: 12, color: "#7c8b9a" },
  title: { fontSize: 14, fontWeight: "700", color: "#2c3e50" },
  place: { fontSize: 13, color: "#5a6b7c" },
  link: { color: "#2c5b86", fontWeight: "700" },
});
