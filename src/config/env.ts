// src/config/env.ts
import Constants from 'expo-constants';

type Extra = {
  APP_ENV: 'development' | 'staging' | 'production';
  baseURL: string;
  mockApi?: boolean;
};

const extra = (Constants?.expoConfig?.extra ?? {}) as Partial<Extra>;

export const ENV = {
  APP_ENV: (extra.APP_ENV ?? 'development') as Extra['APP_ENV'],
  BASE_URL: extra.baseURL ?? 'http://localhost:3000',
  MOCK_API: !!extra.mockApi,
} as const;
