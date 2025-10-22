import { Pressable, PressableProps, View, ActivityIndicator } from 'react-native';
import Text from './Text';
import { colors, spacing, radius } from '@app/theme/tokens';

type Props = PressableProps & { title: string; loading?: boolean; tone?: 'primary' | 'danger' };

export default function Button({ title, loading, disabled, tone = 'primary', ...rest }: Props) {
  const bg = tone === 'danger' ? colors.danger : colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          opacity: pressed || disabled || loading ? 0.7 : 1,
          paddingVertical: spacing.md,
          borderRadius: radius.md,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
      {...rest}
    >
      <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
        {loading ? <ActivityIndicator /> : null}
        <Text variant="body" style={{ fontWeight: '700' }}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
