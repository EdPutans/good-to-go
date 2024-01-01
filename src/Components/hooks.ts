import React, { useEffect, useState } from "react";
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
  const [lastSelectedChecklistId, setLastSelectedChecklistId] = useState(
    fakeList[0].id
  );
  const [visibleSection, setVisibleSection] = React.useState<
    { checklistId: string } | { editChecklistId: string } | "settings" | null
  >();

  const [isSaving, setIsSaving] = useState(false);
  const [availableChecklists, setAvailableChecklists] = useState<Checklist[]>(
    []
  );

  const selectedChecklist =
    (visibleSection &&
      availableChecklists.find((c) => {
        if (
          typeof visibleSection === "object" &&
          "checklistId" in visibleSection
        )
          return c.id === visibleSection?.checklistId;

        return c.id === lastSelectedChecklistId;
      })) ||
    null;

  const setSelectedChecklist = (c: Checklist) => {
    setLastSelectedChecklistId(c.id);
    setVisibleSection({ checklistId: c.id });
  };

  useEffect(() => {
    setAvailableChecklists(fakeList);
    setSelectedChecklist(fakeList[0]);
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

  const handleAddChecklist = (checklist: Checklist) => {
    setAvailableChecklists((prevChecklists) => {
      return [...prevChecklists, checklist];
    });
  };
  const handleRemoveChecklist = (checklistId: string) => {
    setAvailableChecklists((prevChecklists) => {
      return prevChecklists.filter((c) => c.id !== checklistId);
    });

    if (lastSelectedChecklistId === checklistId && availableChecklists[0]) {
      setSelectedChecklist(availableChecklists[0]);
    }
  };

  const handleClearAllCheckboxes = (checklistId: string) => {
    setAvailableChecklists((prevChecklists) => {
      return prevChecklists.map((c) => {
        if (c.id === checklistId) {
          return {
            ...c,
            items: c.items.map((i) => {
              return { ...i, checked: false };
            }),
          };
        }
        return c;
      });
    });
  };

  return {
    availableChecklists,
    handleCheckItem,
    handleClearAllCheckboxes,
    setAvailableChecklists,
    handleSaveChecklist,
    handleAddChecklist,
    handleRemoveChecklist,
    isSaving,
    selectedChecklist,
    setSelectedChecklist,
    visibleSection,
    setVisibleSection,
    lastSelectedChecklistId,
    setLastSelectedChecklistId,
  };
};
