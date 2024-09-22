import { Stack } from "expo-router";
import { StateProvider } from './../context/StateContext'; // Import your context provider

export default function RootLayout() {
  return (
    <StateProvider>
      <Stack screenOptions={{ animation: "ios",animationDuration:200 }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="feeds" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="post" options={{ headerShown: false }} />
         <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </StateProvider>
  );
}
