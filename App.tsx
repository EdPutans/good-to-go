import "react-native-gesture-handler";

import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { MyDrawer } from "./src/Components/Drawer";

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
