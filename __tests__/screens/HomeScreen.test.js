// @ts-nocheck

import React from "react";
import { render } from "@testing-library/react-native";
import HomeScreen from "../../screens/HomeScreen";
import { AuthContext } from "../../Context/AuthenticationContext";

import fetchMock from "jest-fetch-mock";

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

function renderHomeScreen() {
  return render(
    <AuthContext.Provider
      value={{
        authState: {
          spotifyToken: "test",
          isLoading: false,
          userData: {
            country: "ID",
            displayName: "test user",
            email: "test@test.com",
          },
        },
        dispatchAuth: () => {},
      }}
    >
      <HomeScreen navigation={{ navigate: () => {} }} />
    </AuthContext.Provider>
  );
}

test("Smoke test", async () => {
  const { baseElement } = renderHomeScreen();
  expect(baseElement.children.length).toBe(1);
});

test("Loading data error", async () => {
  fetch.mockReject(new Error("test error"));

  const { getByLabelText, findAllByText, debug } = renderHomeScreen();

  debug();
  getByLabelText("loading");
  debug();
  const errorElements = await findAllByText("Error");
  debug();
  console.log({ errorElements });
  expect(errorElements).toBeTruthy();
});
