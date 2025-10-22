// src/app/onboarding.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  require('../../assets/images1.png'),
  require('../../assets/images2.png'),
  require('../../assets/images3.png'),
];

const KEY_SEEN = 'seenOnboarding'; // "1" เมื่อกดจบ/ข้าม
const KEY_COUNT = 'onboardingCount'; // จำนวนครั้งที่เข้ามาหน้านี้

export default function OnboardingScreen() {
  const router = useRouter();
  const ref = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  // --- นับจำนวนครั้งทุกครั้งที่ "เข้า" หน้า onboarding ---
  useEffect(() => {
    (async () => {
      const n = Number(await AsyncStorage.getItem(KEY_COUNT)) || 0;
      await AsyncStorage.setItem(KEY_COUNT, String(n + 1));
    })();
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const i = viewableItems?.[0]?.index ?? 0;
    setIndex(i);
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  async function finish() {
    // ผู้ใช้กด "จบ/ข้าม" -> ตั้ง flag แล้วไม่ต้องเห็นอีกต่อไป
    await AsyncStorage.setItem(KEY_SEEN, '1');
    router.replace('/'); // กันย้อน
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="dark-content" />

      <Pressable
        onPress={finish}
        accessibilityRole="button"
        hitSlop={10}
        style={({ pressed }) => [S.skip, pressed && { opacity: 0.85 }]}
      >
        <Text style={S.skipText}>Skip</Text>
      </Pressable>

      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={S.page}>
            <Image source={item} resizeMode="cover" style={S.bg} />
          </View>
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={S.footer}>
        <View style={S.dotsWrap}>
          {slides.map((_, i) => (
            <View key={i} style={[S.dot, i === index && S.dotActive]} />
          ))}
        </View>
        {index === slides.length - 1 ? (
          <Pressable onPress={finish} style={S.btn}>
            <Text style={S.btnText}>Get Started</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => ref.current?.scrollToIndex({ index: index + 1, animated: true })}
            style={S.btn}
          >
            <Text style={S.btnText}>Next</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const SAFE_TOP = 16;
const S = StyleSheet.create({
  page: { width, height, backgroundColor: 'white' },
  bg: { width, height },
  skip: {
    position: 'absolute',
    top: SAFE_TOP,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D9E2EC',
    zIndex: 10,
    elevation: 1,
  },
  skipText: { color: '#3A4A5A', fontWeight: '600' },
  dotsWrap: { flexDirection: 'row', alignSelf: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 999, backgroundColor: '#C6D3DE' },
  dotActive: { width: 18, backgroundColor: '#4FB2FF' },
  footer: { position: 'absolute', bottom: 24, alignSelf: 'center', gap: 12 },
  btn: {
    backgroundColor: '#4FB2FF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: 'center',
  },
  btnText: { color: '#0B0F14', fontWeight: '700' },
});
