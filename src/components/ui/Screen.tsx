import { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { common } from '@app/theme/styles';

type Props = { children: ReactNode; padded?: boolean };
export default function Screen({ children, padded = true }: Props) {
  return (
    <SafeAreaView style={[common.screen, !padded && { paddingHorizontal: 0, paddingTop: 0 }]}>
      <View style={{ flex: 1 }}>{children}</View>
    </SafeAreaView>
  );
}
