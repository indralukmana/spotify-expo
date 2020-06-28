import * as React from "react";
import tailwind from "tailwind-rn";

import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { getPlaylistItems } from "../services/browse-api";
import { Track } from "../types";
import { AuthContext } from "../Context/AuthenticationContext";
import { RectButton, ScrollView } from "react-native-gesture-handler";
import { StackScreenProps } from "@react-navigation/stack";
import { HomeStackParamList } from "../navigation/navigationTypes";

type PlaylistScreenProps = StackScreenProps<
  HomeStackParamList,
  "PlaylistScreen"
>;

export default function PlaylistScreen({ route }: PlaylistScreenProps) {
  const { authState } = React.useContext(AuthContext);
  const initialState = {
    isLoading: true,
    error: null,
    data: [],
  };
  const [playlistScreenState, setPlaylistScreenState] = React.useState<{
    isLoading: boolean;
    error: Error | null;
    data: Track[];
  }>(initialState);

  React.useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!authState.spotifyToken) {
        return;
      }

      try {
        setPlaylistScreenState(initialState);

        const playlistItems = await getPlaylistItems(
          authState.spotifyToken,
          route.params.playlistId
        );

        setPlaylistScreenState((prevState) => ({
          ...prevState,
          data: playlistItems,
        }));
      } catch (error) {
        setPlaylistScreenState((prevState) => ({ ...prevState, error }));
      } finally {
        setPlaylistScreenState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  if (playlistScreenState.isLoading) {
    return (
      <View style={tailwind("flex-1 justify-center items-center")}>
        <ActivityIndicator />
      </View>
    );
  }

  if (playlistScreenState.error) {
    <View style={tailwind("flex-1 justify-center items-center")}>
      <Text>{playlistScreenState.error.message}</Text>
    </View>;
  }

  return (
    <SafeAreaView style={tailwind("flex-1 justify-center items-center")}>
      <ScrollView style={tailwind("flex-1 w-full")}>
        {playlistScreenState.data.map((track, index) => (
          <RectButton
            key={track.id}
            style={tailwind(
              `w-full py-10 px-5 ${
                index % 2 === 0 ? "bg-blue-200" : "bg-yellow-200"
              }`
            )}
          >
            <View
              style={tailwind("flex-row w-full justify-between")}
              accessible
            >
              <View style={tailwind("flex-wrap")}>
                <Text style={tailwind("text-lg flex-wrap")}>{track.name}</Text>
                <View style={tailwind("flex-row mt-5")}>
                  <Text style={tailwind("font-bold")}>
                    {track.popularity}
                    {"/100"}
                  </Text>
                </View>
                <Text style={tailwind("mt-3")}>Artist:</Text>
                {track.artists.map((artist) => (
                  <Text key={artist.id}>{artist.name}</Text>
                ))}
              </View>
              <Image
                source={{
                  uri: track.album?.images[0]?.url,
                  height: 100,
                  width: 100,
                }}
              />
            </View>
          </RectButton>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
