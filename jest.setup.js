// Minimal Jest setup for React Native / Expo tests
jest.useRealTimers();

// Mock NativeModules that some libraries expect
import { NativeModules } from 'react-native';
NativeModules.RNDeviceInfo = NativeModules.RNDeviceInfo || {};

// Silence console warnings from native modules during tests
const suppressed = ['Setting a timer'];
const originalWarn = console.warn;
console.warn = (...args) => {
  if (typeof args[0] === 'string' && suppressed.some(s => args[0].includes(s))) return;
  originalWarn(...args);
};
