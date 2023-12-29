import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import Main from "./src";

export default function App() {
  return (
    <NavigationContainer>
      {/* <Drawer.Navigator initialRouteName="Home"> */}
      <Main />
      {/* </Drawer.Navigator> */}
    </NavigationContainer>
  );
}
