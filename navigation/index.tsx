import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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

const AuthContext = React.createContext({} as AuthenticationContextType);

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigation() {
  const [authState, dispatchAuth] = React.useReducer(
    (prevState: AuthState, action: AuthAction): AuthState => {
      switch (action.type) {
        case AuthActionTypes.LOG_IN:
          return {
            ...prevState,
            spotifyToken: action.spotifyToken,
            isLoading: false,
          };
        case AuthActionTypes.LOG_OUT:
          return {
            ...prevState,
            spotifyToken: null,
          };
      }
    },
    { isLoading: false, spotifyToken: "" }
  );

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let spotifyToken = null;

      try {
        spotifyToken = await SecureStore.getItemAsync("spotify_token");
      } catch (e) {
        // Restoring token failed
      }

      dispatchAuth({ type: AuthActionTypes.LOG_IN, spotifyToken });
    };

    bootstrapAsync();
  }, []);

  const login = async (spotifyToken: string) => {
    dispatchAuth({ type: AuthActionTypes.LOG_IN, spotifyToken });
  };
  const logout = () => dispatchAuth({ type: AuthActionTypes.LOG_OUT });

  return (
    <AuthContext.Provider
      value={{
        authState,
        login,
        logout,
      }}
    >
      <NavigationContainer linking={LinkingConfiguration}>
        {authState.spotifyToken ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{ title: "Login" }}
            />
          </Stack.Navigator>
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
