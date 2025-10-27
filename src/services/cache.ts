// src/services/cache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

type CacheItem<T> = { data: T; ts: number; ttl: number };

export async function setCache<T>(key: string, data: T, ttlMs: number) {
  const payload: CacheItem<T> = { data, ts: Date.now(), ttl: ttlMs };
  await AsyncStorage.setItem(key, JSON.stringify(payload));
}

export async function getCache<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const item = JSON.parse(raw) as CacheItem<T>;
    if (Date.now() - item.ts > item.ttl) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return item.data;
  } catch {
    await AsyncStorage.removeItem(key);
    return null;
  }
}
