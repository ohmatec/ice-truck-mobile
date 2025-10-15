import { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

type Slide = { key: string; title: string; image: any };
const SLIDES: Slide[] = [
  {
    key: "s1",
    title: "Discover Nearest Location",
    image: require("./assets/images.jpg"),
  },
  {
    key: "s2",
    title: "Pickup & Drop-off Service",
    image: require("./assets/images.jpg"),
  },
  {
    key: "s3",
    title: "Choose Your Trailer Type",
    image: require("./assets/images.jpg"),
  },
];

export default function Onboarding() {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < SLIDES.length - 1)
      ref.current?.scrollToIndex({ index: index + 1, animated: true });
    else router.replace("/details");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skip}
        onPress={() => router.replace("/details")}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={ref}
        data={SLIDES}
        keyExtractor={(i: any) => i.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e: any) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          setIndex(i);
        }}
        renderItem={({ item }: any) => (
          <View style={styles.slide}>
            <View style={styles.illusWrap}>
              <Image
                source={require("./assets/images.jpg")}
                style={{ width: 240, height: 160 }}
              />
            </View>
            <View style={styles.bottomCard}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.dots}>
                {SLIDES.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i === index && styles.dotActive]}
                  />
                ))}
              </View>
              <TouchableOpacity style={styles.cta} onPress={next}>
                <Text style={styles.ctaText}>
                  {index === SLIDES.length - 1 ? "Ready" : "Continue"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const BLUE = "#2c5b86";
const YELLOW = "#f7c351";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eaf0f6" },
  skip: { position: "absolute", top: 48, right: 24, zIndex: 10 },
  skipText: { color: "#5e6b7a", fontSize: 14 },
  slide: { width, alignItems: "center", paddingTop: 84 },
  illusWrap: {
    width: "100%",
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  illus: { width: "80%", height: "100%" },
  bottomCard: {
    width: "86%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: BLUE,
    marginBottom: 16,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 16,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#d4dce6" },
  dotActive: { backgroundColor: BLUE, width: 18 },
  cta: {
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 999,
    backgroundColor: YELLOW,
  },
  ctaText: { fontWeight: "700", color: "#1a2a3a" },
});
