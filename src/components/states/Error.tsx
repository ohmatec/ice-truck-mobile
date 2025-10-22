import { View } from 'react-native';
import Text from '@app/components/ui/Text';
import Button from '@app/components/ui/Button';
import { spacing } from '@app/theme/tokens';

export default function ErrorState({
  label = 'เกิดข้อผิดพลาด',
  onRetry
}: {
  label?: string;
  onRetry?: () => void;
}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg }}>
      <Text variant="caption">{label}</Text>
      {onRetry ? <Button title="ลองอีกครั้ง" onPress={onRetry} /> : null}
    </View>
  );
}
