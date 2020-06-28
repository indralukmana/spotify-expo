import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import * as React from "react";
import * as SecureStore from "expo-secure-store";

import LoginScreen from "../screens/LoginScreen";
import {
  RootStackParamList,
  AuthState,
  AuthAction,
  AuthActionTypes,
  AuthenticationContextType,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

export const AuthContext = React.createContext({} as AuthenticationContextType);

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

export default function Navigation() {
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
    initialAuthState
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let spotifyToken = null;
      let userData = null;

      try {
        spotifyToken = await SecureStore.getItemAsync("spotify_token");
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
          <Tab.Navigator>
            <Tab.Screen name="HomeScreen" component={HomeScreen} />
            <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
          </Tab.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="LoginScreen"
              component={LoginScreen}
              options={{ title: "Login" }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
