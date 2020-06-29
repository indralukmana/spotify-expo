// @ts-nocheck

import React from "react";
import {
  render,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react-native";
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
        dispatchAuth: jest.fn(),
      }}
    >
      <HomeScreen navigation={{ navigate: jest.fn() }} />
    </AuthContext.Provider>
  );
}

test("Loading data error", async () => {
  fetch.mockRejectOnce(new Error("test error"));

  const { getByLabelText, getByText } = renderHomeScreen();

  expect(getByLabelText("loading")).toBeTruthy();

  await waitForElementToBeRemoved(() => getByLabelText("loading"));
  await waitForElement(() => getByText("Error"));
});

test("Loading data success", async () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      playlists: {
        items: [
          {
            id: "1",
            name: "hambarawa",
            tracks: { total: 7777777 },
            images: [{ url: "test", height: 100, width: 100 }],
          },
        ],
      },
    })
  );

  const { getByLabelText, getByText } = renderHomeScreen();

  expect(getByLabelText("loading")).toBeTruthy();

  await waitForElementToBeRemoved(() => getByLabelText("loading"));
  expect(getByText("hambarawa")).toBeTruthy();
  expect(getByText("7777777")).toBeTruthy();
});
