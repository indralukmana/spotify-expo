import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as React from 'react';
import * as SecureStore from 'expo-secure-store';

import {
  RootStackParamList,
  HomeStackParamList,
  HomeTabParamList,
} from './navigationTypes';

import { AuthState, AuthAction, AuthActionTypes } from '../types';

import LinkingConfiguration from './LinkingConfiguration';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { getProfile } from '../services/user-api';
import { AuthContext } from '../Context/AuthenticationContext';
import PlaylistScreen from '../screens/PlaylistScreen';
import TrackDetailScreen from '../screens/TrackDetailScreen';

const Stack = createStackNavigator<RootStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const HomeTab = createBottomTabNavigator<HomeTabParamList>();

const HomeStackNavigator = () => (
  <HomeStack.Navigator initialRouteName="HomeScreen">
    <HomeStack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ title: 'Home' }}
    />
    <HomeStack.Screen
      name="PlaylistScreen"
      component={PlaylistScreen}
      options={{ title: 'Playlist' }}
    />
    <HomeStack.Screen
      name="TrackDetailScreen"
      component={TrackDetailScreen}
      options={{ title: 'Track Detail' }}
    />
  </HomeStack.Navigator>
);

export default function Navigation(): JSX.Element {
  const initialAuthState: AuthState = {
    isLoading: false,
    spotifyToken: null,
    userData: null,
  };

  const [authState, dispatchAuth] = React.useReducer(
    (prevState: AuthState, action: AuthAction): AuthState => {
      switch (action.type) {
        case AuthActionTypes.LOG_IN:
          return {
            ...prevState,
            spotifyToken: action.spotifyToken,
            userData: action.userData,
            isLoading: false,
          };
        case AuthActionTypes.LOG_OUT:
          return {
            ...prevState,
            spotifyToken: null,
            userData: null,
          };
      }
    },
    initialAuthState,
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let spotifyToken = null;
      let userData = null;

      try {
        spotifyToken = await SecureStore.getItemAsync('spotify_token');
        if (spotifyToken) {
          userData = await getProfile(spotifyToken);
        }
      } catch (e) {
        // Restoring token failed
      }

      dispatchAuth({ type: AuthActionTypes.LOG_IN, spotifyToken, userData });
    };

    bootstrapAsync();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        dispatchAuth,
      }}
    >
      <NavigationContainer linking={LinkingConfiguration}>
        {authState.spotifyToken ? (
          <HomeTab.Navigator>
            <HomeTab.Screen
              name="HomeStack"
              component={HomeStackNavigator}
              options={{ title: 'Home' }}
            />
            <HomeTab.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{ title: 'Profile' }}
            />
          </HomeTab.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ title: 'Login' }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
