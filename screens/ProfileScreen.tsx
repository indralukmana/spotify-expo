import * as React from "react";
import tailwind, { getColor } from "tailwind-rn";

import { View, Text, Button } from "react-native";
import { AuthContext } from "../navigation";
import { AuthActionTypes } from "../types";

export default function ProfileScreen() {
  const { dispatchAuth } = React.useContext(AuthContext);

  return (
    <View style={tailwind("flex-1 justify-center items-center")}>
      <Text style={tailwind("font-bold mb-20")}>Profile</Text>
      <Button
        title="log out"
        color={getColor("red-500")}
        onPress={() => dispatchAuth({ type: AuthActionTypes.LOG_OUT })}
      />
    </View>
  );
}
