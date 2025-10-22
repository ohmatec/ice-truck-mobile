// services/store.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type Truck = {
  id: string;
  name: string;
  weightKg: number;
  maxKg: number;
};

export type HistoryItem = {
  id: string;
  truckId: string;
  title: string;
  timeISO: string;
  location: string;
  desc: string;
  highlight?: boolean;
};

const K_TRUCKS = "store:trucks:v1";
const K_HISTORY = "store:history:v1";

// -------- in-memory state --------
let trucks: Truck[] = [];
const historyByTruck: Record<string, HistoryItem[]> = {};

// -------- listeners --------
type TrucksListener = (trucks: Truck[]) => void;
const truckListeners = new Set<TrucksListener>();

type HistListener = (items: HistoryItem[]) => void;
const histListeners: Record<string, Set<HistListener>> = {};

function emitTrucks() {
  for (const l of truckListeners) l([...trucks]);
}
function emitHistory(truckId: string) {
  const set = histListeners[truckId];
  if (!set) return;
  const items = getHistory(truckId);
  for (const l of set) l(items);
}

// -------- persistence --------
async function persist() {
  try {
    await Promise.all([
      AsyncStorage.setItem(K_TRUCKS, JSON.stringify(trucks)),
      AsyncStorage.setItem(K_HISTORY, JSON.stringify(historyByTruck)),
    ]);
  } catch {}
}

async function load() {
  try {
    const [t, h] = await Promise.all([
      AsyncStorage.getItem(K_TRUCKS),
      AsyncStorage.getItem(K_HISTORY),
    ]);

    if (t) trucks = JSON.parse(t);
    if (h) {
      const parsed = JSON.parse(h);
      Object.keys(parsed || {}).forEach((k) => (historyByTruck[k] = parsed[k]));
    }

    // seed ถ้ายังไม่มีข้อมูล
    if (trucks.length === 0) {
      trucks = [
        { id: genId(), name: "Truck A", weightKg: 7282, maxKg: 12000 },
        { id: genId(), name: "Truck B", weightKg: 7506, maxKg: 12000 },
        { id: genId(), name: "Truck C", weightKg: 7208, maxKg: 12000 },
      ];
      for (const t of trucks) historyByTruck[t.id] = [];
      await persist();
    }
  } catch {}
  emitTrucks();
  for (const t of trucks) emitHistory(t.id);
}
load();

// -------- public API (trucks) --------
export function getTrucks() {
  return [...trucks];
}

export function subscribe(listener: TrucksListener) {
  truckListeners.add(listener);
  listener([...trucks]); // emit initial
  return () => void truckListeners.delete(listener);
}

export function addTruck() {
  const t: Truck = { id: genId(), name: genName(), weightKg: 0, maxKg: 12000 };
  trucks = [t, ...trucks];
  historyByTruck[t.id] = [];
  emitTrucks();
  emitHistory(t.id);
  persist();
  return t;
}

export function removeTruck(id: string) {
  trucks = trucks.filter((t) => t.id !== id);
  delete historyByTruck[id];
  emitTrucks();
  persist();
}

export function updateTruck(id: string, patch: Partial<Truck>) {
  trucks = trucks.map((t) => (t.id === id ? { ...t, ...patch } : t));
  emitTrucks();
  persist();
}

// -------- public API (history per truck) --------
export function getHistory(truckId: string) {
  return [...(historyByTruck[truckId] ?? [])].sort(
    (a, b) => new Date(b.timeISO).getTime() - new Date(a.timeISO).getTime()
  );
}

export function subscribeHistory(truckId: string, listener: HistListener) {
  if (!histListeners[truckId]) histListeners[truckId] = new Set<HistListener>();
  const set = histListeners[truckId];
  set.add(listener);
  listener(getHistory(truckId));
  return () => void set.delete(listener);
}

export function addHistory(
  truckId: string,
  item: Omit<HistoryItem, "id" | "truckId" | "timeISO"> & { timeISO?: string }
) {
  const list = historyByTruck[truckId] ?? (historyByTruck[truckId] = []);
  const newItem: HistoryItem = {
  id: genHistId(),
  truckId,
  timeISO: item.timeISO ?? new Date().toISOString(),
  title: item.title,
  location: item.location,
  desc: item.desc,
  highlight: item.highlight ?? false,   // ✅ บังคับเป็น boolean
  // หรือ: highlight: !!item.highlight
};

  // ถ้าเป็น live ให้ upsert (เก็บรายการ live ล่าสุด 1 รายการ)
  if (newItem.title.toLowerCase().includes("live position")) {
    const idx = list.findIndex(
      (x) => x.title.toLowerCase() === "live position"
    );
    if (idx >= 0) list.splice(idx, 1);
  }
  list.unshift(newItem);
  emitHistory(truckId);
  persist();
}

// -------- helpers --------
function genId() {
  return (
    "T-" +
    Date.now().toString().slice(-6) +
    "-" +
    Math.random().toString(36).slice(2, 5).toUpperCase()
  );
}
function genHistId() {
  return Math.random().toString(36).slice(2, 10);
}
function genName() {
  const n = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return "Truck " + n[Math.floor(Math.random() * n.length)];
}
