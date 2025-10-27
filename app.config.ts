// app.config.ts
import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const APP_ENV = process.env.APP_ENV ?? 'development';
  const MOCK_API = (process.env.MOCK_API ?? 'true') === 'true';

  const map = {
    development: { baseURL: 'https://dev.api.ice-truck.local' },
    staging: { baseURL: 'https://staging.api.ice-truck.example.com' },
    production: { baseURL: 'https://api.ice-truck.example.com' },
  } as const;

  const current = map[APP_ENV as keyof typeof map] ?? map.development;

  return {
    ...config,
    name: config.name ?? 'ice-truck-mobile',
    slug: config.slug ?? 'ice-truck-mobile',
    extra: {
      APP_ENV,
      baseURL: current.baseURL,
      mockApi: MOCK_API,
    },
    runtimeVersion: { policy: 'sdkVersion' },
  };
};
