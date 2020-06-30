import { Artist, Album } from '../types';

export type RootStackParamList = {
  LoginScreen: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  PlaylistScreen: { playlistId: string };
  TrackDetailScreen: {
    name: string;
    artists: Artist[];
    album: Album;
    duration: number;
  };
};

export type HomeTabParamList = {
  HomeStack: undefined;
  ProfileScreen: undefined;
};
