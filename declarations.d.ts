// declarations.d.ts (เพิ่มไว้ที่ท้ายไฟล์)
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
}
declare module "expo-router/entry" {
  const entry: any;
  export default entry;
}


