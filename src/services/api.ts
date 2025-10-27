// src/services/api.ts
import { http } from "./http";
import { ENDPOINTS } from "./endpoints";
// ใช้ relative เพื่อตัดปัญหา alias
import { ENV } from "../config/env";

import { isHistoryItemDTO, isTruckDTO } from "../types/dto";
import type { TruckDTO, HistoryItemDTO } from "../types/dto";

import { toTruck, toHistoryItem } from "./adapters/truck";
import type { Truck, HistoryItem } from "../types/model";

import { getCache, setCache } from "./cache";

const TTL_MS = 30_000; // 30s

/* -------------------- Mock -------------------- */

async function mockDelay<T>(data: T, ms = 500): Promise<T> {
  await new Promise((r) => setTimeout(r, ms));
  return data;
}

const mockTrucks: TruckDTO[] = [
  { id: "t01", name: "Ice Truck #01", maxKg: 5000, weightKg: 1500 },
  { id: "t02", name: "Ice Truck #02", maxKg: 4500, weightKg: 2200 },
];

const mockHistory: HistoryItemDTO[] = [
  {
    id: "h01",
    truckId: "t01",
    title: "Live position",
    location: "Bangkok, TH",
    desc: "Lat 13.7563, Lng 100.5018",
    highlight: true,
    timeISO: new Date().toISOString(),
  },
];

async function mockGetTrucks(): Promise<Truck[]> {
  const data = mockTrucks.filter(isTruckDTO).map(toTruck);
  return mockDelay(data);
}

async function mockGetTruckById(id: string): Promise<Truck> {
  const dto = mockTrucks.find((t) => t.id === id);
  if (!dto || !isTruckDTO(dto)) throw new Error("Not found");
  return mockDelay(toTruck(dto));
}

async function mockGetHistoryByTruck(id: string): Promise<HistoryItem[]> {
  const data = mockHistory
    .filter((h) => h.truckId === id && isHistoryItemDTO(h))
    .map(toHistoryItem);
  return mockDelay(data);
}

async function mockUpdateTruck(
  id: string,
  patch: Partial<Pick<Truck, "weightKg">>
): Promise<Truck> {
  const idx = mockTrucks.findIndex((t) => t.id === id);
  if (idx < 0) throw new Error("Not found");
  mockTrucks[idx] = { ...mockTrucks[idx], ...patch };
  return mockDelay(toTruck(mockTrucks[idx]));
}

/* -------------------- Real API -------------------- */
// หมายเหตุ:
// - ถ้า http.ts ของคุณเป็น "fetch wrapper" ที่ return ตัว T เลย
//   โค้ดด้านล่างถูกต้องแล้ว (ไม่มี .data)
// - ถ้า http.ts ใช้ axios.create() และคืน AxiosResponse<T>
//   เปลี่ยนบรรทัดที่มีคอมเมนต์ // axios ให้ใช้ .data

export async function getTrucks(): Promise<Truck[]> {
  const key = "cache:trucks";
  const cached = await getCache<Truck[]>(key);
  if (cached) return cached;

  if (ENV.MOCK_API) {
    const data = await mockGetTrucks();
    await setCache(key, data, TTL_MS);
    return data;
  }

  // fetch-wrapper
  const list = await http.get<TruckDTO[]>(ENDPOINTS.trucks);
  // axios: const list = (await http.get<TruckDTO[]>(ENDPOINTS.trucks)).data;
  const data = list.filter(isTruckDTO).map(toTruck);
  await setCache(key, data, TTL_MS);
  return data;
}

export async function getTruckById(id: string): Promise<Truck> {
  if (ENV.MOCK_API) return mockGetTruckById(id);

  // fetch-wrapper
  const dto = await http.get<TruckDTO>(ENDPOINTS.truckById(id));
  // axios: const dto = (await http.get<TruckDTO>(ENDPOINTS.truckById(id))).data;
  if (!isTruckDTO(dto)) throw new Error("Invalid payload");
  return toTruck(dto);
}

export async function getHistoryByTruck(id: string): Promise<HistoryItem[]> {
  const key = `cache:history:${id}`;
  const cached = await getCache<HistoryItem[]>(key);
  if (cached) return cached;

  if (ENV.MOCK_API) {
    const data = await mockGetHistoryByTruck(id);
    await setCache(key, data, TTL_MS);
    return data;
  }

  // fetch-wrapper
  const list = await http.get<HistoryItemDTO[]>(ENDPOINTS.historyByTruck(id));
  // axios: const list = (await http.get<HistoryItemDTO[]>(ENDPOINTS.historyByTruck(id))).data;
  const data = list.filter(isHistoryItemDTO).map(toHistoryItem);
  await setCache(key, data, TTL_MS);
  return data;
}

export async function updateTruckLoad(
  id: string,
  weightKg: number
): Promise<Truck> {
  if (ENV.MOCK_API) return mockUpdateTruck(id, { weightKg });

  // fetch-wrapper
  const dto = await http.patch<TruckDTO>(ENDPOINTS.truckById(id), { weightKg });
  // axios: const dto = (await http.patch<TruckDTO>(ENDPOINTS.truckById(id), { weightKg })).data;
  if (!isTruckDTO(dto)) throw new Error("Invalid payload");
  return toTruck(dto);
}
