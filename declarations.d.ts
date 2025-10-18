// declarations.d.ts (เพิ่มไว้ที่ท้ายไฟล์)
declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}
// This file intentionally left blank to avoid accidentally shadowing real
// type declarations from @types/react / @types/react-native in local dev.

