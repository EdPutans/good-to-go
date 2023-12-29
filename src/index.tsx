import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, Text } from "react-native-paper";

import ChecklistScreen from "./Components/ChecklistScreen";
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

  const onToggleDrawer = () => {
    navigation.toggleDrawer();
  };

  useEffect(() => {
    AsyncStorage.setItem("activeChecklistId", "1");
    AsyncStorage.setItem(
      "checklists",
      JSON.stringify([
        {
          id: "1",
          name: "test",
          items: [
            { id: "1", name: "test", checked: false },
            { id: "3", name: "Collect dog poo", checked: false },
            { id: "2", name: "Yiff", checked: true },
          ],
        },
      ] as Checklist[])
    );
    setVisibleSection("checklist");
    getActiveChecklist().then((checklist) => {
      console.log(checklist);
      setActiveChecklist(checklist);
    });
  }, []);

  const getSavedChecklists = async (): Promise<Checklist[]> => {
    const savedChecklists = await AsyncStorage.getItem("checklists");

    if (savedChecklists) {
      return JSON.parse(savedChecklists);
    }
    return [];
  };

  const getActiveChecklistId = async (): Promise<string | null> => {
    const activeChecklistId = await AsyncStorage.getItem("activeChecklistId");

    if (activeChecklistId) {
      return activeChecklistId;
    }
    return null;
  };

  const saveChecklist = async (checklist: Checklist) => {
    const savedChecklists = await getSavedChecklists();

    const checklistIndex = savedChecklists.findIndex(
      (c) => c.id === checklist.id
    );

    if (checklistIndex === -1) {
      savedChecklists.push(checklist);
    } else {
      savedChecklists[checklistIndex] = checklist;
    }

    await AsyncStorage.setItem("checklists", JSON.stringify(savedChecklists));
  };

  const getActiveChecklist = async (): Promise<Checklist | null> => {
    const activeChecklistId = await getActiveChecklistId();
    if (!activeChecklistId) return null;

    const savedChecklists = await getSavedChecklists();
    return savedChecklists.find((c) => c.id === activeChecklistId) || null;
  };

  const getChecklistById = async (id: string) => {
    return (await getSavedChecklists()).find((c) => c.id === id);
  };

  const handleSetActiveChecklist = async (id: string) => {
    const checklist = await getChecklistById(id);

    if (!checklist) return;

    setActiveChecklist(checklist);
    AsyncStorage.setItem("activeChecklistId", JSON.stringify(checklist.id));
  };

  // if no checklist - render a button to add your first checklist)

  const handleCheckItem = async (itemId: string) => {
    const activeChecklistId = await getActiveChecklistId();
    if (!activeChecklistId) return;

    const checklist = await getChecklistById(activeChecklistId);
    if (!checklist) return;

    checklist.items = checklist.items.map((item) => {
      if (item.id === itemId) {
        item.checked = !item.checked;
      }
      return item;
    });

    // find the item in the checklist
    saveChecklist(checklist);
    setActiveChecklist(checklist);
    // update the item's checked status
    // save the checklist
  };

  return (
    <View style={styles.container}>
      <Appbar>
        <Appbar.Action icon="menu" onPress={onToggleDrawer} />
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
          handleCheckItem={handleCheckItem}
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
