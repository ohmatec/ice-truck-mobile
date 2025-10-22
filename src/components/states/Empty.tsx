import { View } from 'react-native';
import Text from '@app/components/ui/Text';
import { spacing } from '@app/theme/tokens';

export default function Empty({ label = 'ไม่พบข้อมูล' }: { label?: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md }}>
      <Text variant="caption">{label}</Text>
    </View>
  );
}
