import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checklist } from "../types";
import { onboardingList } from "./FirstLoadSampleList";

export const seed = () => {
  AsyncStorage.setItem("activeChecklistId", "1");
  AsyncStorage.setItem(
    "checklists",
    JSON.stringify(onboardingList as Checklist[])
  );
};

export const getSavedChecklists = async (): Promise<Checklist[]> => {
  const savedChecklists = await AsyncStorage.getItem("checklists");

  if (savedChecklists) {
    return JSON.parse(savedChecklists);
  }
  return [];
};

export const getActiveChecklistId = async (): Promise<string | null> => {
  const activeChecklistId = await AsyncStorage.getItem("activeChecklistId");

  if (activeChecklistId) {
    return activeChecklistId;
  }
  return null;
};

export const saveChecklist = async (checklist: Checklist) => {
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

export const getActiveChecklist = async (): Promise<Checklist | null> => {
  const activeChecklistId = await getActiveChecklistId();
  if (!activeChecklistId) return null;

  const savedChecklists = await getSavedChecklists();
  return savedChecklists.find((c) => c.id === activeChecklistId) || null;
};

export const getChecklistById = async (id: string) => {
  return (await getSavedChecklists()).find((c) => c.id === id);
};

export const handleSetActiveChecklist = async (id: string) => {
  const checklist = await getChecklistById(id);

  if (!checklist) return null;

  AsyncStorage.setItem("activeChecklistId", checklist.id);
  return checklist;
};

// if no checklist - render a button to add your first checklist)

export const handleCheckItem = async (itemId: string) => {
  const activeChecklistId = await getActiveChecklistId();
  if (!activeChecklistId) {
    return null;
  }

  const checklist = await getChecklistById(activeChecklistId);
  if (!checklist) {
    console.log("no checklist", { activeChecklistId });
    return null;
  }

  checklist.items = checklist.items.map((item) => {
    if (item.id === itemId) {
      item.checked = !item.checked;
    }
    return item;
  });

  // find the item in the checklist
  saveChecklist(checklist);
  return checklist;
  // update the item's checked status
  // save the checklist
};
