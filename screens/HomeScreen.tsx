import * as React from 'react';
import tailwind from 'tailwind-rn';

import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { getFeaturedPlaylists } from '../services/browse-api';
import { FeaturedPlaylist } from '../types';
import { AuthContext } from '../Context/AuthenticationContext';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/navigationTypes';

type HomeScreenProps = StackScreenProps<HomeStackParamList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
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

  const loadData = React.useCallback(async () => {
    if (!authState.spotifyToken || !authState.userData?.country) {
      return;
    }

    try {
      setHomeScreenState(initialState);

      const featuredPlaylists = await getFeaturedPlaylists(
        authState.spotifyToken,
        authState.userData?.country,
        20,
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
  }, [authState]);

  React.useEffect(() => {
    let mounted = true;

    loadData();

    return () => {
      mounted = false;
    };
  }, [loadData]);

  if (homeScreenState.isLoading) {
    return (
      <View style={tailwind('flex-1 justify-center items-center')}>
        <ActivityIndicator accessibilityLabel="loading" />
      </View>
    );
  }

  if (!homeScreenState.isLoading && homeScreenState.error) {
    return (
      <View style={tailwind('flex-1 justify-center items-center')}>
        <Text>Error</Text>
        <Text>{homeScreenState.error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tailwind('flex-1 justify-center items-center')}>
      <ScrollView
        style={tailwind('flex-1 w-full')}
        accessibilityLabel="home view"
      >
        {homeScreenState.data.map((playlist, index) => (
          <RectButton
            key={playlist.id}
            onPress={() =>
              navigation.navigate('PlaylistScreen', {
                playlistId: playlist.id,
              })
            }
            style={tailwind(
              `w-full py-10 px-5 ${
                index % 2 === 0 ? 'bg-blue-200' : 'bg-yellow-200'
              }`,
            )}
          >
            <View style={tailwind('flex-row justify-between')} accessible>
              <View>
                <Text style={tailwind('text-lg')}>{playlist.name}</Text>
                <View style={tailwind('flex-row mt-5')}>
                  <Text style={tailwind('font-bold')}>
                    {playlist.tracks.total}
                  </Text>
                  <Text style={tailwind('ml-1')}>Songs</Text>
                </View>
              </View>
              {playlist.images.map((image) => (
                <Image
                  key={image.url}
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
