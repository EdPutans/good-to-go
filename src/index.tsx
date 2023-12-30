import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

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

const Main = ({ navigation }) => {
  const [visibleSection, setVisibleSection] = useState<Section>("checklist");
  const [activeChecklist, setActiveChecklist] = useState<Checklist | null>(
    null
  );

  useEffect(() => {
    // seed();
    setVisibleSection("checklist");
    getActiveChecklist().then((checklist) => {
      setActiveChecklist(checklist);
    });
  }, []);

  const [sidebarVisible, setSidebarVisible] = useState(false);
  const toggleSidebarVisible = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <View style={styles.container}>
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
