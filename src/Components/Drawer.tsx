import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import Main from "..";
import { Checklist } from "../types";
import { getSavedChecklists } from "./utils";

const Drawer = createDrawerNavigator();

export function MyDrawer() {
  const [availableChecklists, setAvailableChecklists] = useState<
    Checklist[] | null
  >(null);

  useEffect(() => {
    getSavedChecklists().then((checklists) => {
      setAvailableChecklists(checklists);
    });
  }, []);

  if (!availableChecklists) return null;

  return (
    <Drawer.Navigator>
      {availableChecklists.map((checklist) => (
        <Drawer.Screen
          name={checklist.name}
          component={Main}
          key={checklist.id}
        />
      ))}
      {/* <Drawer.Screen name={"Checklist"} component={Main} /> */}
      {/* <Drawer.Screen name={"Checklist"} component={Main} /> */}
    </Drawer.Navigator>
  );
}
