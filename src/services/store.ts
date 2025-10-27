// src/services/store.ts
// Store เบา ๆ ด้วย in-memory + pub-sub + (opt) persist ทีหลังได้
export type Truck = {
  id: string;
  name: string;
  maxKg: number;
  weightKg: number;
};

export type HistoryItem = {
  id: string;
  truckId: string;
  title: string;
  location: string;
  desc: string;
  highlight: boolean;
  timeISO: string;
};

// ====== in-memory state ======
let trucks: Truck[] = [
  { id: "t01", name: "Ice Truck #01", maxKg: 5000, weightKg: 1500 },
  { id: "t02", name: "Ice Truck #02", maxKg: 4500, weightKg: 2200 },
];

const historyMap = new Map<string, HistoryItem[]>();

type Sub<T> = (v: T) => void;
const truckSubs = new Set<Sub<Truck[]>>();
const historySubs = new Map<string, Set<Sub<HistoryItem[]>>>();

// ====== utils ======
const randId = (prefix = "t") =>
  `${prefix}${Math.random().toString(36).slice(2, 8)}`;

const emitTrucks = () => {
  const snapshot = [...trucks];
  truckSubs.forEach((fn) => fn(snapshot));
};

const emitHistory = (truckId: string) => {
  const list = historyMap.get(truckId) ?? [];
  const subs = historySubs.get(truckId);
  if (subs) subs.forEach((fn) => fn([...list]));
};

// ====== Truck APIs ======
export function getTrucks(): Truck[] {
  return [...trucks];
}

export function subscribe(fn: Sub<Truck[]>) {
  truckSubs.add(fn);
  fn([...trucks]);
  return () => {
    truckSubs.delete(fn);
  };
}

export function addTruck() {
  const id = randId("t");
  const newTruck: Truck = {
    id,
    name: `Ice Truck ${id.toUpperCase()}`,
    maxKg: 5000,
    weightKg: 0,
  };
  trucks = [newTruck, ...trucks];
  emitTrucks();
  return id;
}

export function removeTruck(id: string) {
  trucks = trucks.filter((t) => t.id !== id);
  emitTrucks();
  // ลบ history ของคันนั้นด้วย (ถ้ามี)
  historyMap.delete(id);
  historySubs.delete(id);
}

export function updateTruck(
  id: string,
  patch: Partial<Pick<Truck, "name" | "maxKg" | "weightKg">>
) {
  const idx = trucks.findIndex((t) => t.id === id);
  if (idx < 0) return;
  trucks[idx] = { ...trucks[idx], ...patch };
  emitTrucks();
}

// ====== History APIs ======
export function getHistory(truckId: string): HistoryItem[] {
  return [...(historyMap.get(truckId) ?? [])];
}

export function subscribeHistory(truckId: string, fn: Sub<HistoryItem[]>) {
  if (!historySubs.has(truckId)) historySubs.set(truckId, new Set());
  const set = historySubs.get(truckId)!;
  set.add(fn);
  fn(getHistory(truckId));
  return () => {
    set.delete(fn);
    if (set.size === 0) historySubs.delete(truckId);
  };
}

export function addHistory(
  truckId: string,
  item: Omit<HistoryItem, "id" | "truckId">
) {
  const id = randId("h");
  const list = historyMap.get(truckId) ?? [];
  const rec: HistoryItem = { id, truckId, ...item };
  historyMap.set(truckId, [rec, ...list]);
  emitHistory(truckId);
}
