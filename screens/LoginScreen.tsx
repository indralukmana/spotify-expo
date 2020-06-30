import * as React from 'react';
import tailwind from 'tailwind-rn';

import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from 'expo-auth-session';

import { Platform, View, Text, Button } from 'react-native';
import { getProfile } from '../services/user-api';
import { AuthActionTypes } from '../types';
import { AuthContext } from '../Context/AuthenticationContext';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
};

export default function LoginScreen() {
  const { dispatchAuth } = React.useContext(AuthContext);
  const [loginError, setLoginError] = React.useState<Error | null>(null);

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: 'd949b5b3d39a4b88b79564b5312971f1',
      scopes: [
        'user-read-email',
        'playlist-modify-public',
        'user-read-private',
      ],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        native: 'spotifyexpo://redirect',
      }),
    },
    discovery,
  );

  React.useEffect(() => {
    let mounted = true;

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

    if (mounted && response && response.type === 'success') {
      const spotifyToken = response.params.access_token;
      if (Platform.OS !== 'web') {
        SecureStore.setItemAsync('spotify_token', spotifyToken);
      }
      doLogin(spotifyToken);
    }

    return () => {
      mounted = false;
    };
  }, [response]);

  return (
    <View style={tailwind('flex-1 justify-center items-center')}>
      <Text style={tailwind('font-bold mb-20')}>Spotify Expo</Text>
      <Button title="Log In" onPress={() => promptAsync({ useProxy: false })} />
      {/* <Text>
        {makeRedirectUri({
          native: "spotifyexpo://redirect",
          useProxy: true,
        })}
      </Text> */}
    </View>
  );
}
