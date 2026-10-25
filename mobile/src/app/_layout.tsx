import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { palette } from '../constants/palette';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.paper } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="idea" />
      </Stack>
    </>
  );
}
