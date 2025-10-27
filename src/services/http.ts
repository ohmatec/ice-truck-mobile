// src/services/http.ts
import axios, { AxiosError } from "axios";
import { ENV } from "@src/config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mapAxiosError } from "./error";

const instance = axios.create({
  baseURL: ENV.BASE_URL,
  timeout: 10_000, // 10s
});

// เพิ่ม metadata ให้ request ใช้ retry/backoff
instance.interceptors.request.use(async (config) => {
  (config as any).meta = { retry: 3, retryDelay: 400, ...(config as any).meta };
  // แนบ token (ถ้ามี)
  const token = await AsyncStorage.getItem("auth:token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  if (__DEV__) {
    // logger แบบเบา ๆ
    // eslint-disable-next-line no-console
    console.log(
      "➡️ [HTTP]",
      config.method?.toUpperCase(),
      config.baseURL + (config.url ?? "")
    );
  }
  return config;
});

// response/logger + retry
instance.interceptors.response.use(
  (res) => {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log("✅ [HTTP]", res.status, res.config.url);
    }
    return res;
  },
  async (error: AxiosError) => {
    const cfg: any = error.config ?? {};
    const meta = cfg.meta ?? { retry: 0, retryDelay: 0 };

    // retry เฉพาะ network/5xx
    const status = error.response?.status;
    const shouldRetry =
      (!status || (status >= 500 && status < 600)) &&
      meta.retry &&
      meta.retry > 0;

    if (shouldRetry) {
      meta.retry -= 1;
      cfg.meta = meta;
      const delay = meta.retryDelay ?? 400;
      await new Promise((r) => setTimeout(r, delay));
      return instance(cfg);
    }

    throw mapAxiosError(error);
  }
);

export const http = instance;
