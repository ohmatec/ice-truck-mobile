// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// ใช้ svg-transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// ให้ .svg เป็น "source" (ไม่ใช่ asset ธรรมดา)
config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;
