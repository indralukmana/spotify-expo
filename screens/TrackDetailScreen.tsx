import * as React from 'react';
import tailwind from 'tailwind-rn';

import { View, Text, SafeAreaView, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { StackScreenProps } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/navigationTypes';

type TrackDetailScreenProps = StackScreenProps<
  HomeStackParamList,
  'TrackDetailScreen'
>;

export default function TrackDetailScreen({
  route,
}: TrackDetailScreenProps): JSX.Element {
  const { name, album, artists, duration } = route.params;

  function durationConvert(ms: number) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ':' + (Number(seconds) < 10 ? '0' : '') + seconds;
  }

  return (
    <SafeAreaView style={tailwind('flex-1 justify-center items-center')}>
      <ScrollView style={tailwind('flex-1 w-full')}>
        <View
          style={tailwind('flex-1 justify-between items-center pt-20')}
          accessible
        >
          <Image
            source={{
              uri: album?.images[0]?.url,
            }}
            style={{ height: 300, width: 300 }}
            resizeMode="center"
          />
          <Text style={tailwind('text-lg flex-wrap')}>{name}</Text>
          <Text style={tailwind('text-lg flex-wrap')}>
            {durationConvert(duration)}
          </Text>
          <Text style={tailwind('mt-3')}>Artist:</Text>
          {artists.map((artist) => (
            <Text key={artist.id}>{artist.name}</Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
