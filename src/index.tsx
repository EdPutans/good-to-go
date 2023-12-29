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
    // seed();
    setVisibleSection("checklist");
    getActiveChecklist().then((checklist) => {
      console.log(checklist);
      setActiveChecklist(checklist);
    });
  }, []);

  const toggleSidebarVisible = () => {
    setVisibleSection("checklist");
  };

  return (
    <View style={styles.container}>
      <Appbar>
        <Appbar.Action icon="menu" onPress={toggleSidebarVisible} />
        <Appbar.Content title={activeChecklist?.name} />
      </Appbar>

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
    </View>
  );
};

export default Main;
