import * as React from 'react';
import tailwind, { getColor } from 'tailwind-rn';

import { View, Text, Button } from 'react-native';
import { AuthActionTypes } from '../types';
import { AuthContext } from '../Context/AuthenticationContext';

export default function ProfileScreen(): JSX.Element {
  const { dispatchAuth, authState } = React.useContext(AuthContext);

  return (
    <View style={tailwind('flex-1 justify-center items-center')}>
      <Text style={tailwind('font-bold')}>Profile</Text>
      <Text style={tailwind('mt-10')}>
        Name: {authState.userData?.displayName}
      </Text>
      <Text style={tailwind('mt-3')}>Email: {authState.userData?.email}</Text>
      <Text style={tailwind('mt-3 mb-5')}>
        Country: {authState.userData?.country}
      </Text>
      <Button
        title="log out"
        color={getColor('red-500')}
        onPress={() => dispatchAuth({ type: AuthActionTypes.LOG_OUT })}
      />
    </View>
  );
}
