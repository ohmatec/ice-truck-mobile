// app/index.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Pressable, StyleSheet, FlatList, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addTruck, removeTruck, subscribe, getTrucks, Truck } from '../services/store';

export default function IndexScreen() {
  const router = useRouter();
  const [trucks, setTrucks] = useState<Truck[]>(getTrucks());

  useEffect(() => {
    const unsubscribe = subscribe(setTrucks);
    // cleanup ต้องเป็นฟังก์ชันหรือ undefined เท่านั้น
    return typeof unsubscribe === 'function' ? unsubscribe : undefined;
  }, []);

  function confirmRemove(id: string) {
    Alert.alert('Remove truck', 'Do you want to remove this truck?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeTruck(id) },
    ]);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F6F8FB' }}>
      <StatusBar style="dark" />
      <FlatList
        data={trucks}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View style={S.header}>
            <Text style={S.h1}>Tracking History</Text>
            <Pressable
              style={S.addBtn}
              onPress={() => addTruck()}
              accessibilityRole="button"
              accessibilityLabel="Add a new truck"
            >
              <Ionicons name="add" size={18} color="#fff" />
              <Text style={S.addTxt}>Add Truck</Text>
            </Pressable>
            <Text style={S.sectionTitle}>Your Trucks</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <Text style={{ color: '#8A97A8' }}>No trucks yet. Tap “Add Truck”.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={TR.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <MaterialCommunityIcons name="truck" size={20} color="#3BA0FF" />
              <View style={{ flex: 1 }}>
                <Text style={TR.name}>{item.name}</Text>
                <Text style={TR.sub}>ID: {item.id}</Text>
              </View>
              <Pressable
                style={TR.cta}
                accessibilityRole="button"
                accessibilityLabel={`See detail of truck ${item.id}`}
                onPress={() => router.push({ pathname: '/details', params: { tid: item.id } })}
              >
                <Text style={TR.ctaText}>See Detail</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </Pressable>
              <Pressable
                style={TR.bin}
                onPress={() => confirmRemove(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Remove truck ${item.id}`}
              >
                <Ionicons name="trash" size={18} color="#FF6E7A" />
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const S = StyleSheet.create({
  header: { gap: 12, marginBottom: 8 },
  h1: { fontSize: 18, fontWeight: '800', color: '#1F2A37' },
  addBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#3BA0FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  addTxt: { color: '#fff', fontWeight: '800' },
  sectionTitle: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2A37',
  },
});

const TR = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EEF5',
    padding: 12,
    marginTop: 10,
  },
  name: { color: '#1F2A37', fontWeight: '800' },
  sub: { color: '#8A97A8', marginTop: 2, fontSize: 12 },
  cta: {
    backgroundColor: '#3BA0FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  ctaText: { color: '#fff', fontWeight: '800' },
  bin: {
    marginLeft: 8,
    backgroundColor: '#FFECEF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
});
