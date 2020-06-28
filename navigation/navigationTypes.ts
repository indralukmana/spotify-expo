import { Image } from "../types";

export type RootStackParamList = {
  LoginScreen: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  PlaylistScreen: { playlistId: string };
};

export type HomeTabParamList = {
  HomeStack: undefined;
  ProfileScreen: undefined;
};
