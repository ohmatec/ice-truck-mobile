import Button from '@app/components/ui/Button';
export default function RetryButton({ onPress }: { onPress: () => void }) {
  return <Button title="ลองอีกครั้ง" onPress={onPress} />;
}
