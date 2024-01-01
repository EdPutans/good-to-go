import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

import ChecklistScreen from "./Components/ChecklistScreen";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Main = ({ checklist, ...props }) => {
  return (
    <View style={styles.container}>
      {!checklist && <Text>Create one!</Text>}

      <ChecklistScreen
        checklist={checklist}
        handleCheckItem={props.handleCheckItem}
      />
    </View>
  );
};

export default Main;
