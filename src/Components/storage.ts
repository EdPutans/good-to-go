import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checklist } from "../types";

const CURRENTLY_SELECTED_CHECKLIST = "CURRENTLT_SELECTED_CHECKLIST";
const AVAILABLE_CHECKLISTS = "AVAILABLE_CHECKLISTS";
const IS_FIRST_TIME = "IS_FIRST_TIME";

const getCurrentlySelectedChecklistId = async (): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(CURRENTLY_SELECTED_CHECKLIST);
    if (value !== null) {
      return value;
    }
    return null;
  } catch (error) {
    return null;
  }
};

const setCurrentlySelectedChecklistId = async (id: string) => {
  try {
    await AsyncStorage.setItem(CURRENTLY_SELECTED_CHECKLIST, id);
  } catch (error) {
    console.log(error);
  }
};

const getAvailableChecklists = async (): Promise<Checklist[] | null> => {
  try {
    const value = await AsyncStorage.getItem(AVAILABLE_CHECKLISTS);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    return null;
  }
};
const setAvailableChecklists = async (checklists: Checklist[]) => {
  try {
    const checklistsToSave = JSON.stringify(checklists);
    await AsyncStorage.setItem(AVAILABLE_CHECKLISTS, checklistsToSave);
  } catch (error) {
    console.log(error);
  }
};

const getIsFirstTime = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(IS_FIRST_TIME);
    if (value !== null) {
      return JSON.parse(value) as boolean;
    }
    return true;
  } catch (error) {
    return true;
  }
};
const setIsFirstTime = async (isFirstTime: boolean) => {
  try {
    await AsyncStorage.setItem(IS_FIRST_TIME, JSON.stringify(isFirstTime));
  } catch (error) {
    console.log(error);
  }
};

export const localStorage = {
  getCurrentlySelectedChecklistId,
  setCurrentlySelectedChecklistId,
  getAvailableChecklists,
  setAvailableChecklists,
  getIsFirstTime,
  setIsFirstTime,
};
