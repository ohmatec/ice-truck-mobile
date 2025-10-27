// src/types/dto.ts

export type TruckDTO = {
  id: string;
  name: string;
  maxKg: number;
  weightKg: number;
};

export type HistoryItemDTO = {
  id: string;
  truckId: string;
  title: string;
  location: string;
  desc: string;
  timeISO: string;        // ISO8601 string
  highlight?: boolean;    // optional
};

/* ---------- Helpers ---------- */
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const isNum = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);

/* ---------- Type Guards ---------- */
export function isTruckDTO(x: unknown): x is TruckDTO {
  if (!isObj(x)) return false;
  return (
    typeof x.id === "string" &&
    typeof x.name === "string" &&
    isNum(x.maxKg) &&
    isNum(x.weightKg)
  );
}

export function isHistoryItemDTO(x: unknown): x is HistoryItemDTO {
  if (!isObj(x)) return false;
  const okRequired =
    typeof x.id === "string" &&
    typeof x.truckId === "string" &&
    typeof x.title === "string" &&
    typeof x.location === "string" &&
    typeof x.desc === "string" &&
    typeof x.timeISO === "string";
  const okOptional =
    !("highlight" in x) || typeof (x as any).highlight === "boolean";
  return okRequired && okOptional;
}

/* ---------- Asserts (สะดวกเวลาใช้ในโค้ดจริง) ---------- */
export function assertTruckDTO(x: unknown): asserts x is TruckDTO {
  if (!isTruckDTO(x)) throw new Error("Invalid TruckDTO");
}

export function assertHistoryItemDTO(x: unknown): asserts x is HistoryItemDTO {
  if (!isHistoryItemDTO(x)) throw new Error("Invalid HistoryItemDTO");
}
