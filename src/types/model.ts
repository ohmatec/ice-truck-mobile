// src/types/model.ts

/** โครงสร้างข้อมูลที่ใช้ "ภายในแอป" (หลังแปลงจาก DTO แล้ว) */
export type Truck = {
  /** คงที่ตลอดอายุข้อมูล */
  readonly id: string;
  /** ชื่อรถ (ปรับแก้ได้) */
  name: string;
  /** ความจุสูงสุด (กก.) */
  readonly maxKg: number;
  /** น้ำหนักปัจจุบัน (กก.) */
  weightKg: number;
};

export type HistoryItem = {
  readonly id: string;
  readonly truckId: string;
  title: string;
  location: string;
  desc: string;
  /**
   * ไฮไลต์อีเวนต์หรือไม่
   * - ทำเป็น optional เพื่อให้สอดคล้องกับ DTO (exactOptionalPropertyTypes)
   * - ถ้าไม่กำหนด ให้ตีความเป็น false ที่ชั้น UI/adapter
   */
  highlight?: boolean;
  /** เวลาแบบ Date (แปลงมาจาก DTO.timeISO) */
  time: Date;
};

/* ---------- Type Guards (ใช้งานตอนรับ/รวมข้อมูลข้ามเลเยอร์ได้) ---------- */

export function isTruck(x: unknown): x is Truck {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as any).id === "string" &&
    typeof (x as any).name === "string" &&
    typeof (x as any).maxKg === "number" &&
    typeof (x as any).weightKg === "number"
  );
}

export function isHistoryItem(x: unknown): x is HistoryItem {
  if (typeof x !== "object" || x === null) return false;
  const v = x as any;
  const okRequired =
    typeof v.id === "string" &&
    typeof v.truckId === "string" &&
    typeof v.title === "string" &&
    typeof v.location === "string" &&
    typeof v.desc === "string" &&
    v.time instanceof Date;
  const okOptional = !("highlight" in v) || typeof v.highlight === "boolean";
  return okRequired && okOptional;
}

/* ---------- Patch Types (ช่วยให้ store/update พิมพ์ปลอดภัยขึ้น) ---------- */

export type TruckPatch = Partial<Pick<Truck, "name" | "weightKg">>;
export type HistoryItemPatch = Partial<
  Pick<HistoryItem, "title" | "location" | "desc" | "highlight" | "time">
>;
