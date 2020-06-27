export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
};

export enum AuthActionTypes {
  LOG_IN = "LOG_IN",
  LOG_OUT = "LOG_OUT",
}

export type AuthAction =
  | {
      type: AuthActionTypes.LOG_IN;
      spotifyToken: string | null;
    }
  | { type: AuthActionTypes.LOG_OUT };

export type AuthState = {
  isLoading: boolean;
  spotifyToken: string | null;
};

export type AuthenticationContextType = {
  authState: AuthState;
  login: (spotifyToken: string) => void;
  logout: () => void;
};
