import { useEffect, useState } from "react";
import { Checklist } from "../types";
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
export const useChecklistState = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [availableChecklists, setAvailableChecklists] = useState<Checklist[]>(
    []
  );
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(
    null
  );

  useEffect(() => {
    if (!availableChecklists?.length) {
      setAvailableChecklists(fakeList);
    }
    setSelectedChecklist(availableChecklists[0]);
  }, [availableChecklists]);

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

  const handleSaveChecklist = (checklist: Checklist) => {
    setIsSaving(true);
    const replaceCh = availableChecklists.findIndex(
      (c) => c.id === checklist.id
    );

    if (replaceCh !== -1) {
      setAvailableChecklists((prevChecklists) => {
        prevChecklists[replaceCh] = checklist;
        return prevChecklists;
      });
    } else {
      setAvailableChecklists((prevChecklists) => {
        return [...prevChecklists, checklist];
      });
    }

    setIsSaving(false);
  };

  return {
    availableChecklists,
    handleCheckItem,
    setAvailableChecklists,
    handleSaveChecklist,
    isSaving,
    selectedChecklist,
    setSelectedChecklist,
  };
};
