import React from 'react';
import { render } from '@testing-library/react-native';

import LoginScreen from '../../screens/LoginScreen';

test('Smoke test', async () => {
  const { baseElement } = render(<LoginScreen />);
  expect(baseElement.children.length).toBe(1);
});

test('login button rendered', async () => {
  const { getByText } = render(<LoginScreen />);
  getByText('Log In');
});
