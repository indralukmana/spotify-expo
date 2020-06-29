import React from "react";
import { render } from "@testing-library/react-native";

import App from "../App";

test("Smoke test", async () => {
  const { baseElement } = render(<App />);

  expect(baseElement.children.length).toBe(1);
});
