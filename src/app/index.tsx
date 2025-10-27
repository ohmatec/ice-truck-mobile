// app/index.tsx
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  addTruck,
  getTrucks,
  subscribe,
  removeTruck,
  updateTruck,
  type Truck,
} from "../services/store";

export default function HomeScreen() {
  const router = useRouter();

  const [trucks, setTrucks] = useState<Truck[]>(getTrucks());
  useEffect(() => {
    const unsub = subscribe(setTrucks);
    return unsub;
  }, []);

  // ===== Add Truck Modal state =====
  const [showAdd, setShowAdd] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [weightInput, setWeightInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openAdd = () => {
    setNameInput("");
    setWeightInput("");
    setShowAdd(true);
  };
  const closeAdd = () => setShowAdd(false);

  const submitAdd = () => {
    if (submitting) return;
    const name = nameInput.trim() || "New Truck";
    const w = Number(weightInput);
    if (Number.isNaN(w) || w < 0) {
      Alert.alert(
        "Invalid weight",
        "Please enter a valid non-negative number."
      );
      return;
    }

    setSubmitting(true);

    // เก็บ id ก่อนเพิ่ม
    const prevIds = new Set(getTrucks().map((t) => t.id));

    // one-shot subscribe: ยกเลิกก่อนที่จะ updateTruck เพื่อกัน loop
    let onceUnsub: (() => void) | null = null;
    onceUnsub = subscribe((list) => {
      if (list.length <= prevIds.size) return;
      const newly = list.find((t) => !prevIds.has(t.id));
      if (!newly) return;

      // 🔑 ตัดลูป: ถอนตัวเองออกก่อนค่อยอัปเดต
      const u = onceUnsub;
      if (u) {
        u();
        onceUnsub = null;
      }

      updateTruck(newly.id, { name, weightKg: w });

      setShowAdd(false);
      setSubmitting(false);
      router.push({ pathname: "/details", params: { tid: newly.id } });
    });

    // trigger เพิ่มรถ (store จะสุ่ม id แล้ว emit → เข้าบล็อกด้านบน)
    addTruck();
  };

  const goDetails = (t?: Truck) => {
    if (!t) return;
    router.push({ pathname: "/details", params: { tid: t.id } });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F6F8FB" }}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View style={S.rowBetween}>
          <Text style={S.h1}>Tracking History</Text>
          <Pressable
            style={[S.addBtn, submitting && { opacity: 0.6 }]}
            onPress={openAdd}
            disabled={submitting}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={S.addTxt}>Add Truck</Text>
          </Pressable>
        </View>

        <Text style={[S.h2, { marginTop: 18 }]}>Your Trucks</Text>

        {trucks.length === 0 ? (
          <View>
            <Text style={Empty.title}>No trucks yet</Text>
            <Text style={Empty.desc}>Press “Add Truck” to create one.</Text>
          </View>
        ) : (
          trucks.map((t) => (
            <TruckRow key={t.id} truck={t} onPress={() => goDetails(t)} />
          ))
        )}
      </ScrollView>

      {/* ===== Add Truck Modal ===== */}
      <Modal
        visible={showAdd}
        transparent
        animationType="slide"
        onRequestClose={closeAdd}
      >
        <KeyboardAvoidingView
          style={M.wrapper}
          behavior={Platform.select({ ios: "padding", android: undefined })}
        >
          <View style={M.backdrop}>
            <Pressable style={{ flex: 1 }} onPress={closeAdd} />
          </View>

          <View style={M.sheet}>
            <Text style={M.title}>Add New Truck</Text>

            <View style={{ marginTop: 12 }}>
              <Text style={M.label}>Truck Name</Text>
              <TextInput
                placeholder="e.g. Ice Truck #03"
                placeholderTextColor="#9AA5B1"
                style={M.input}
                value={nameInput}
                onChangeText={setNameInput}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={{ marginTop: 12 }}>
              <Text style={M.label}>Initial Weight (KG)</Text>
              <TextInput
                placeholder="e.g. 1200"
                placeholderTextColor="#9AA5B1"
                style={M.input}
                keyboardType="numeric"
                value={weightInput}
                onChangeText={setWeightInput}
                returnKeyType="done"
              />
            </View>

            <View style={M.row}>
              <Pressable
                style={[M.btn, M.btnGhost]}
                onPress={closeAdd}
                accessibilityLabel="Cancel"
              >
                <Text style={[M.btnTxt, { color: "#1F2A37" }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[M.btn, M.btnPrimary, submitting && { opacity: 0.6 }]}
                onPress={submitAdd}
                disabled={submitting}
                accessibilityLabel="Add"
              >
                <Text style={[M.btnTxt, { color: "#fff" }]}>Add</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function TruckRow({ truck, onPress }: { truck: Truck; onPress: () => void }) {
  const confirmRemove = () => {
    Alert.alert(
      "Delete Truck",
      `Are you sure you want to delete "${truck.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => removeTruck(truck.id),
        },
      ]
    );
  };

  return (
    <View style={TR.card}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <MaterialCommunityIcons name="truck" size={20} color="#3BA0FF" />
        <View style={{ flex: 1 }}>
          <Text style={TR.name}>{truck.name}</Text>
          <Text style={TR.sub}>ID: {truck.id}</Text>
        </View>

        <Pressable
          style={TR.cta}
          onPress={onPress}
          accessibilityLabel="See detail"
        >
          <Text style={TR.ctaText}>See Detail</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </Pressable>

        <Pressable
          onPress={confirmRemove}
          accessibilityLabel="Delete truck"
          style={TR.deleteBtn}
        >
          <MaterialCommunityIcons
            name="trash-can-outline"
            size={18}
            color="#ff0015ff"
          />
        </Pressable>
      </View>
    </View>
  );
}

const S = StyleSheet.create({
  h1: { fontSize: 18, fontWeight: "800", color: "#1F2A37" },
  h2: { fontSize: 16, fontWeight: "800", color: "#1F2A37" },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addBtn: {
    backgroundColor: "#3BA0FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  addTxt: { color: "#fff", fontWeight: "800" },
});

const TR = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E8EEF5",
    padding: 12,
    marginTop: 10,
  },
  name: { color: "#1F2A37", fontWeight: "800" },
  sub: { color: "#8A97A8", marginTop: 2, fontSize: 12 },
  deleteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 6,
  },
  cta: {
    backgroundColor: "#3BA0FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  ctaText: { color: "#fff", fontWeight: "800" },
});

const Empty = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E8EEF5",
    borderRadius: 14,
    padding: 16,
    marginTop: 10,
  },
  title: { fontWeight: "800", color: "#1F2A37" },
  desc: { marginTop: 6, color: "#8A97A8", fontSize: 12 },
});

const M = StyleSheet.create({
  wrapper: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: { fontSize: 16, fontWeight: "800", color: "#1F2A37" },
  label: { color: "#1F2A37", fontWeight: "700", marginBottom: 6 },
  input: {
    backgroundColor: "#F3F6FA",
    borderWidth: 1,
    borderColor: "#E1E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#1F2A37",
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    justifyContent: "flex-end",
  },
  btn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  btnTxt: { fontWeight: "800" },
  btnGhost: { backgroundColor: "#EFF4FA" },
  btnPrimary: { backgroundColor: "#3BA0FF" },
});
