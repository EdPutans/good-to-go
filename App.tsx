import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { NavigationContainer } from "@react-navigation/native";
import Main from "./src";

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name={activeChecklist?.name} component={Main} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
