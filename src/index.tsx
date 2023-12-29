import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";

import ChecklistScreen from "./Components/ChecklistScreen";
import { getActiveChecklist, handleCheckItem } from "./Components/utils";
import { Checklist, Section } from "./types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
const Main = () => {
  const [visibleSection, setVisibleSection] = useState<Section>("checklist");
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(
    null
  );

  useEffect(() => {
    // seed()
    setVisibleSection("checklist");
    getActiveChecklist().then((checklist) => {
      console.log(checklist);
      setActiveChecklist(checklist);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Appbar>
        {/* <Appbar.Action icon="menu" onPress={onToggleDrawer} /> */}
        <Text variant="headlineMedium">
          {activeChecklist?.name || "No active checklist"}
        </Text>
      </Appbar>
      {/* <Drawer.Section title="Some title">
      <Drawer.Item
        onPress={() => {
          setVisibleSection("checklist");
        }}
        label="Checklist"
      />
      <Drawer.Item
        onPress={() => {
          setVisibleSection("settings");
        }}
        label="Settings"
      />
      <Drawer.Item
        onPress={() => {
          setVisibleSection("single-edit");
        }}
        label="Single Edit"
      />
    </Drawer.Section> */}

      {!activeChecklist && <Text>Create one!</Text>}

      {visibleSection === "checklist" && (
        <ChecklistScreen
          checklist={activeChecklist}
          handleCheckItem={async (itemId) => {
            const newCHecklist = await handleCheckItem(itemId);
            setActiveChecklist(newCHecklist);
          }}
        />
      )}
      {/* {visibleSection === "settings" && (
    <Sidebar
    //  onChangeActiveChecklist={handleSetActiveChecklist}
    />
  )} */}
      {/* {visibleSection === "single-edit" && <SingleEditScreen />} */}
    </View>
  );
};

export default Main;
