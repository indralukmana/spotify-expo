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
import { getProfile } from "../services/user-api";
import { AuthContext } from "../navigation";
import { AuthActionTypes } from "../types";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
};

export default function LoginScreen() {
  const { dispatchAuth } = React.useContext(AuthContext);
  const [loginError, setLoginError] = React.useState<Error | null>(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: "d949b5b3d39a4b88b79564b5312971f1",
      scopes: [
        "user-read-email",
        "playlist-modify-public",
        "user-read-private",
      ],
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
    const doLogin = async (spotifyToken: string) => {
      try {
        const userData = await getProfile(spotifyToken);
        dispatchAuth({
          type: AuthActionTypes.LOG_IN,
          spotifyToken,
          userData,
        });
      } catch (error) {
        setLoginError(error);
      }
    };

    if (response && response.type === "success") {
      const spotifyToken = response.params.access_token;
      if (Platform.OS !== "web") {
        SecureStore.setItemAsync("spotify_token", spotifyToken);
      }
      doLogin(spotifyToken);
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
