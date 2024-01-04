import React, { useEffect, useMemo } from "react";

import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { setStatusBarStyle } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from "react-native-paper";
import { Navigator } from "./src/Components/Navigator";

export default function App() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#49b18a" });

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme]
  );

  useEffect(() => {
    setStatusBarStyle(colorScheme === "dark" ? "dark" : "light");
  }, [colorScheme]);

  return (
    <PaperProvider theme={paperTheme}>
      <Navigator />
    </PaperProvider>
  );
}
