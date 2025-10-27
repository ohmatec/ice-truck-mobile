// src/services/endpoints.ts
export const ENDPOINTS = {
  trucks: '/trucks',
  truckById: (id: string) => `/trucks/${id}`,
  historyByTruck: (id: string) => `/trucks/${id}/history`,
} as const;
