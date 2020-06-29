const expoPreset = require("jest-expo/jest-preset");
const jestPreset = require("@testing-library/react-native/jest-preset");

module.exports = Object.assign(
  expoPreset,
  jestPreset,
  {
    setupFiles: [...expoPreset.setupFiles, ...jestPreset.setupFiles],
    setupFilesAfterEnv: ["@testing-library/react-native/cleanup-after-each"],
  },
  {
    transformIgnorePatterns: [
      "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|@sentry/.*)",
    ],
    testMatch: ["**/__tests__/**/*.+(ts|tsx|js)"],
    preset: "jest-expo/universal",
    projects: [
      {
        preset: "jest-expo/ios",
      },
      {
        preset: "jest-expo/android",
      },
    ],
  }
);
