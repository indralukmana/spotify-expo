import * as React from "react";
import tailwind from "tailwind-rn";

import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { getFeaturedPlaylists } from "../services/browse-api";
import { FeaturedPlaylist } from "../types";
import { AuthContext } from "../Context/AuthenticationContext";
import { RectButton, ScrollView } from "react-native-gesture-handler";

export default function PlaylistScreen() {
  const { authState } = React.useContext(AuthContext);
  const initialState = {
    isLoading: true,
    error: null,
    data: [],
  };
  const [homeScreenState, setHomeScreenState] = React.useState<{
    isLoading: boolean;
    error: Error | null;
    data: FeaturedPlaylist[];
  }>(initialState);

  React.useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!authState.spotifyToken || !authState.userData?.country) {
        return;
      }

      try {
        setHomeScreenState(initialState);

        const featuredPlaylists = await getFeaturedPlaylists(
          authState.spotifyToken,
          authState.userData?.country,
          20
        );

        setHomeScreenState((prevState) => ({
          ...prevState,
          data: featuredPlaylists,
        }));
      } catch (error) {
        setHomeScreenState((prevState) => ({ ...prevState, error }));
      } finally {
        setHomeScreenState((prevState) => ({ ...prevState, isLoading: false }));
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  if (homeScreenState.isLoading) {
    console.log({ homeScreenState });
    return (
      <View style={tailwind("flex-1 justify-center items-center")}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={tailwind("flex-1 justify-center items-center")}>
      <Text style={tailwind("font-bold mb-20")}>Playlist</Text>
      <ScrollView style={tailwind("flex-1 w-full")}>
        {homeScreenState.data.map((playlist, index) => (
          <RectButton
            style={tailwind(
              `w-full py-10 px-5 ${
                index % 2 === 0 ? "bg-blue-200" : "bg-yellow-200"
              }`
            )}
          >
            <View style={tailwind("flex-row justify-between")} accessible>
              <View>
                <Text style={tailwind("text-lg")}>{playlist.name}</Text>
                <View style={tailwind("flex-row mt-5")}>
                  <Text style={tailwind("font-bold")}>
                    {playlist.tracks.total}
                  </Text>
                  <Text style={tailwind("ml-5")}>Songs</Text>
                </View>
              </View>
              {playlist.images.map((image) => (
                <Image
                  source={{
                    uri: image.url,
                    height: image.height ?? 100,
                    width: image.width ?? 100,
                  }}
                />
              ))}
            </View>
          </RectButton>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
