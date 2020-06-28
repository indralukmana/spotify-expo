export type RootStackParamList = {
  LoginScreen: undefined;
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

export type Image = {
  height: null | number;
  url: string;
  width: null | number;
};

export type FeaturedPlaylist = {
  collaborative: false;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: {
    display_name: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  primary_color: null;
  public: null;
  snapshot_id: string;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
};
