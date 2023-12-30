import { createDrawerNavigator } from "@react-navigation/drawer";
import { useEffect, useState } from "react";
import Main from "..";
import { Checklist } from "../types";
import ManageChecklists from "./ManageChecklists";

const fakeList = [
  {
    id: "1",
    name: "test",
    items: [
      { id: "1", name: "test", checked: false },
      { id: "3", name: "Collect dog poo", checked: false },
      { id: "2", name: "Yiff", checked: true },
    ],
  },
  {
    id: "2",
    name: "alt",
    items: [
      { id: "1", name: "Take a shit", checked: false },
      { id: "3", name: "Break a knee", checked: true },
      { id: "2", name: "Yeer", checked: false },
    ],
  },
];

const Drawer = createDrawerNavigator();

const useChecklistState = () => {
  const [availableChecklists, setAvailableChecklists] = useState<Checklist[]>(
    []
  );

  useEffect(() => {
    setAvailableChecklists(fakeList);
  }, []);

  const handleCheckItem = (checklistId: string, itemId: string) => {
    setAvailableChecklists((prevChecklists) => {
      return prevChecklists.map((checklist) => {
        if (checklist.id === checklistId) {
          const updatedItems = checklist.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, checked: !item.checked };
            }
            return item;
          });
          return { ...checklist, items: updatedItems };
        }
        return checklist;
      });
    });
  };

  return { availableChecklists, handleCheckItem };
};

export function Navigator() {
  const handlers = useChecklistState();
  const { availableChecklists } = handlers;
  if (!availableChecklists) return null;

  return (
    <Drawer.Navigator>
      {availableChecklists.map((checklist) => (
        <Drawer.Screen
          navigationKey={checklist.id}
          name={checklist.name}
          options={{ title: checklist.name }}
          //@ts-ignore
          component={(...props) => (
            //@ts-ignore
            <Main checklist={checklist} {...handlers} {...props} />
          )}
          key={checklist.id}
        />
      ))}
      {/* </Drawer.Group> */}

      <Drawer.Screen name={"Options"} component={ManageChecklists} />
    </Drawer.Navigator>
  );
}
