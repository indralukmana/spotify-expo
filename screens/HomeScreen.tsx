import * as React from "react";
import tailwind from "tailwind-rn";

import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    <View style={tailwind("flex-1 justify-center items-center")}>
      <Text style={tailwind("font-bold mb-20")}>Spotify Expo Home</Text>
    </View>
  );
}
