// src/services/errors.ts
import type { AxiosError } from 'axios';

export class AppError extends Error {
  code?: string | number;
  status?: number;
  constructor(message: string, opts?: { code?: string | number; status?: number }) {
    super(message);
    this.name = 'AppError';
    this.code = opts?.code;
    this.status = opts?.status;
  }
}

export const mapAxiosError = (err: unknown): AppError => {
  const ax = err as AxiosError;
  if (ax?.response) {
    const status = ax.response.status;
    const msg =
      (ax.response.data as any)?.message ||
      (ax.response.data as any)?.error ||
      ax.message ||
      'Request failed';
    return new AppError(msg, { status, code: status });
  }
  if (ax?.code === 'ECONNABORTED') {
    return new AppError('Request timeout', { code: ax.code });
  }
  return new AppError((ax && ax.message) || 'Network error');
};
