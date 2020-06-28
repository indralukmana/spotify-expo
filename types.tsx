export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
};

export enum AuthActionTypes {
  LOG_IN = "LOG_IN",
  LOG_OUT = "LOG_OUT",
}

export type UserData = {
  displayName: string;
  email: string;
  country: string;
};

export type AuthAction =
  | {
      type: AuthActionTypes.LOG_IN;
      spotifyToken: string | null;
      userData: UserData | null;
    }
  | { type: AuthActionTypes.LOG_OUT };

export type AuthState = {
  isLoading: boolean;
  spotifyToken: string | null;
  userData: UserData | null;
};

export type AuthenticationContextType = {
  authState: AuthState;
  dispatchAuth: React.Dispatch<AuthAction>;
};
