import { View, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const webClientId = "907374281624-gvg831t96pcbd2snuhno0uqv5e18ptgo.apps.googleusercontent.com";
  const androidClientId = "907374281624-16dsi7qf6kci9i2j5sivc3tnj9jtlgtc.apps.googleusercontent.com";

  const [error, setError] = useState();
  const [userInfo, setUserInfo] = useState();

  const config = {
    webClientId,
    androidClientId,
     scopes: ['profile', 'email'], // Add necessary scopes
  };

  const [request, response, promptAsync] = Google.useAuthRequest(config);

  const handleToken = () => {
    if (response && response.type === "success") {
      const { authentication } = response;
      const token = authentication.accessToken;
      console.log("access token", token);
    }
  };

  useEffect(() => {
    handleToken();
  }, [response]);

  return (
    <View style={{paddingTop:200}}>
      <TouchableOpacity onPress={() => promptAsync()}>
        <Text>Login here</Text>
      </TouchableOpacity>
    </View>
  );
}
