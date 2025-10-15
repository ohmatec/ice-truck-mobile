// app/onboarding.tsx
import React, { useRef, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

// ภาพพื้นหลังของแต่ละสไลด์ (ทำให้หน้าตาเหมือนดีไซน์ที่สุด)
const slides = [
  require("../assets/images1.png"),
  require("../assets/images2.png"),
  require("../assets/images3.png"),
];

async function setSeen() {
  await AsyncStorage.setItem("seenOnboarding", "1");
}

function SkipButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Skip onboarding"
      hitSlop={10}
      style={({ pressed }) => [S.skip, pressed && { opacity: 0.85 }]}
    >
      <Text style={S.skipText}>Skip</Text>
    </Pressable>
  );
}

function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={10}
      style={({ pressed }) => [S.btn, pressed && { transform: [{ scale: 0.98 }] }]}
    >
      <Text style={S.btnText}>{label}</Text>
    </Pressable>
  );
}

function PagerDots({ total, index }: { total: number; index: number }) {
  return (
    <View style={S.dotsWrap}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[S.dot, i === index && S.dotActive]} />
      ))}
    </View>
  );
}

function OnboardSlide({ source }: { source: any }) {
  return (
    <View style={S.page}>
      {/* ใช้ภาพเต็มจอเพื่อให้พื้นหลัง/โค้งล่างเหมือนดีไซน์ */}
      <Image source={source} resizeMode="cover" style={S.bg} />
    </View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const ref = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const i = viewableItems?.[0]?.index ?? 0;
    setIndex(i);
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

async function finish() {
  // บันทึกว่าเคยเห็น Onboarding แล้ว
 await AsyncStorage.removeItem("seenOnboarding");
  // ไปหน้า Home และกันย้อนกลับ
  router.replace("/");
}


  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar barStyle="dark-content" />

      {/* ปุ่ม Skip มุมขวาบนตามดีไซน์ */}
      <SkipButton onPress={finish} />

      {/* สไลด์แบบเต็มจอ */}
      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => <OnboardSlide source={item} />}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Dots + ปุ่ม Next/Get Started ตำแหน่งกึ่งล่าง (ลอยเหนือภาพ) */}
      <View style={S.footer}>
        <PagerDots total={slides.length} index={index} />
        {index === slides.length - 1 ? (
          <PrimaryButton label="Get Started" onPress={finish} />
        ) : (
          <PrimaryButton
            label="Next"
            onPress={() => ref.current?.scrollToIndex({ index: index + 1, animated: true })}
          />
        )}
      </View>
    </View>
  );
}

const SAFE_TOP = 16; // เผื่อ notch/สถานะบาร์

const S = StyleSheet.create({
  page: {
    width,
    height,
    backgroundColor: "white",
  },
  bg: {
    width,
    height,
  },

  // Skip pill ขอบบาง สีอ่อน เหมือนภาพ
  skip: {
    position: "absolute",
    top: SAFE_TOP,
    right: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D9E2EC",
    zIndex: 10,
    elevation: 1, // เงาบาง ๆ บน Android
  },
  skipText: { color: "#3A4A5A", fontWeight: "600" },

  // Dots: วงกลมเทา + อันที่เลือกเป็นแคปซูลยาว (เหมือนภาพ)
  dotsWrap: {
    flexDirection: "row",
    alignSelf: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#C6D3DE",
  },
  dotActive: {
    width: 18,
    backgroundColor: "#4FB2FF",
  },

  footer: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    gap: 12,
  },

  // ปุ่มหลัก
  btn: {
    backgroundColor: "#4FB2FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    alignSelf: "center",
  },
  btnText: { color: "#0B0F14", fontWeight: "700" },
});
