import { ActivityIndicator, View } from 'react-native';
import Text from '@app/components/ui/Text';
import { colors, spacing } from '@app/theme/tokens';

export default function Loading({ label = 'กำลังโหลด...' }: { label?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text variant="caption">{label}</Text>
    </View>
  );
}
