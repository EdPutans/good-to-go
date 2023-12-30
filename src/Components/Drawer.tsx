import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import Main from "..";
import { Checklist } from "../types";
import ManageChecklists from "./ManageChecklists";
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
      <Drawer.Group>
        {availableChecklists.map((checklist) => (
          <Drawer.Screen
            name={checklist.name}
            component={Main}
            key={checklist.id}
          />
        ))}
      </Drawer.Group>

      <Drawer.Screen name={"Options"} component={ManageChecklists} />
    </Drawer.Navigator>
  );
}
