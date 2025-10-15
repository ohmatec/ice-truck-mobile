import AsyncStorage from "@react-native-async-storage/async-storage";
const KEY = "seenOnboarding";
export async function setSeenOnboarding() { await AsyncStorage.setItem(KEY, "1"); }
export async function hasSeenOnboarding() { return (await AsyncStorage.getItem(KEY)) === "1"; }
