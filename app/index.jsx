import { Text, View } from "react-native";
import { Redirect } from "expo-router";

export default function Index() {
   const user = true
  return (
    <View
    >
      {user? <Redirect href={'/feeds'}/>: <Redirect href={'/login'}/> }
    </View>
  );
}
