import { Text as RNText, TextProps } from 'react-native';
import { common } from '@src/theme/styles';

type Variant = 'h1' | 'h2' | 'body' | 'caption';

export default function Text({
  variant = 'body',
  style,
  ...rest
}: TextProps & { variant?: Variant }) {
  const map = {
    h1: common.h1,
    h2: common.h2,
    body: common.body,
    caption: common.caption
  } as const;
  return <RNText accessibilityRole="text" style={[map[variant], style]} {...rest} />;
}
