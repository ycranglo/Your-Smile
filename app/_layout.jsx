import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{animation:"fade"}}>
      <Stack.Screen name="index" options={{
        headerShown:false
      }} />
      <Stack.Screen name="feeds" options={{
        headerShown:false
      }} />
      <Stack.Screen name="profile" options={{
        headerShown:false
      }} />
       <Stack.Screen name="post" options={{
        headerShown:false
      }} />
    </Stack>
  );
}
