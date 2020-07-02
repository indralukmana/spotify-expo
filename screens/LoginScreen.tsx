import * as React from 'react';
import tailwind from 'tailwind-rn';

import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

import {
  makeRedirectUri,
  useAuthRequest,
  ResponseType,
} from 'expo-auth-session';

import { Platform, View, Text, Button, ActivityIndicator } from 'react-native';
import { getProfile } from '../services/user-api';
import { AuthActionTypes } from '../types';
import { AuthContext } from '../Context/AuthenticationContext';

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
};

export default function LoginScreen(): JSX.Element {
  const { dispatchAuth } = React.useContext(AuthContext);
  const initialScreenState: { isLoading: boolean; error: Error | null } = {
    isLoading: false,
    error: null,
  };

  const [loginScreenState, setLoginScreenState] = React.useState(
    initialScreenState,
  );

  const [, response, promptAsync] = useAuthRequest(
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
      if (loginScreenState.isLoading) {
        return;
      }
      try {
        setLoginScreenState((prevState) => ({ ...prevState, isLoading: true }));

        const userData = await getProfile(spotifyToken);
        dispatchAuth({
          type: AuthActionTypes.LOG_IN,
          spotifyToken,
          userData,
        });
      } catch (error) {
        setLoginScreenState((prevState) => ({ ...prevState, error }));
      } finally {
        setLoginScreenState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
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
  });

  if (loginScreenState.isLoading) {
    return (
      <View style={tailwind('flex-1 justify-center items-center')}>
        <ActivityIndicator accessibilityLabel="loading" />
      </View>
    );
  }

  if (!loginScreenState.isLoading && loginScreenState.error) {
    return (
      <View style={tailwind('flex-1 justify-center items-center')}>
        <Text>Error</Text>
        <Text>{loginScreenState.error.message}</Text>
      </View>
    );
  }

  return (
    <View style={tailwind('flex-1 justify-center items-center')}>
      <Text style={tailwind('font-bold mb-20')}>Spotify Expo</Text>
      <Button title="Log In" onPress={() => promptAsync({ useProxy: false })} />
    </View>
  );
}
