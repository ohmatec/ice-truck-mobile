// components/TruckFromSvg.tsx
import React, { useCallback, useState } from "react";
import { View, LayoutChangeEvent } from "react-native";
import TruckAsset from "../assets/truck.svg"; // << ไฟล์ SVG จาก Figma

type Props = { fillPct: number; height?: number; };

/** พิกัดตู้ (หน่วย viewBox) — แก้ให้ตรงกับ truck.svg ของคุณ */
const VB_W = 740;  // ดูจาก viewBox="0 0 740 300"
const VB_H = 199;
const cargoX = 108;
const cargoY = 0.5;
const cargoW = 460;
const cargoH = 120;

export default function TruckFromSvg({ fillPct, height = 120 }: Props) {
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const onLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setFrame({ w: width, h: height });
  }, []);
  const sx = frame.w / VB_W, sy = frame.h / VB_H;
  const pct = Math.max(0, Math.min(100, fillPct));
  const left = cargoX * sx;
  const top = cargoY * sy;
  const width = (cargoW * pct) / 113.5 * sx;
  const heightPx = cargoH * sy;
  const radius = 8 * ((sx + sy) / 2);

  return (
    <View style={{ width: "100%", height, position: "relative" }} onLayout={onLayout}>
      <TruckAsset width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
      {frame.w > 0 && (
        <View
          style={{
            position: "absolute", left, top, width, height: heightPx,
            backgroundColor: "rgba(0, 131, 245, 0.92)",
            borderTopLeftRadius: radius, borderBottomLeftRadius: radius,
          }}
        />
      )}
    </View>
  );
}
