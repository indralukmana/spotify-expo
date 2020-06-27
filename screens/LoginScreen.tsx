import * as React from "react";
import tailwind from "tailwind-rn";

import { RectButton } from "react-native-gesture-handler";

import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";

import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from "expo-auth-session";
import { Platform, View, Text } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
};
export default function LoginScreen() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "d949b5b3d39a4b88b79564b5312971f1",
      scopes: ["user-read-email", "playlist-modify-public"],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        native: "https://auth.expo.io/@indralukmana/spotify-app",
        useProxy: false,
        preferLocalhost: true,
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response && response.type === "success") {
      const token = response.params.access_token;
      if (Platform.OS !== "web") {
        // Securely store the auth on your device
        SecureStore.setItemAsync("spotify_token", token);
      }
    }
  }, [response]);

  return (
    <View style={tailwind("flex-1 justify-center items-center")}>
      <Text style={tailwind("font-bold mb-20")}>Spotify Expo</Text>
      <RectButton
        onPress={() => promptAsync({ useProxy: false })}
        activeOpacity={0}
      >
        <View
          style={tailwind("py-3 px-2 rounded-lg text-center bg-yellow-500")}
        >
          <Text>Login</Text>
        </View>
      </RectButton>
    </View>
  );
}
