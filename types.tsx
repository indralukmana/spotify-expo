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

export type Artist = {
  external_urls: {
    spotify: string;
  };
  spotify: string;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

export type Album = {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: {
    spotify: string;
  };
  spotify: string;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
};

export type Track = {
  album: Album;
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: { isrc: string };
  isrc: string;
  external_urls: {
    spotify: string;
  };
  spotify: string;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
};
