import React, { useEffect, useState } from "react";
import { Checklist } from "../types";
import { onboardingList } from "./FirstLoadSampleList";

const listOfEmojis:string[] = ["🍕", "🍔", "🍟", "🍗", "🥩", "🥓", "🍖", "🌭", "🍿", "🧂", "🥚", "🍳", "🥞", "🧇", "🥓", "🥯", "🥨", "🥐", "🍞", "🥖", "🥪", "🌮", "🌯", "🥙", "🧆", "🥘", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "🍼", "☕️", "🍵", "🧃", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🍾", "🧉", "🧊", "🥄", "🍴", "🍽", "🥣", "🥡", "🥢", "🧂", "🧈", "🍽", "🍴", "🥄", "🥣", "🥡", "🥢", "🧂", "🧈", "🍽", "🍴", "🥄", "🥣", "🥡", "🥢", "🗿"]
export const getRandomEmoji = () => {
  return listOfEmojis[Math.floor(Math.random() * listOfEmojis.length)];
}

export const useChecklistState = () => {
  const [lastSelectedChecklistId, setLastSelectedChecklistId] = useState(
    onboardingList[0].id
  );

  const [visibleSection, setVisibleSection] = React.useState<
    { checklistId: string } | { editChecklistId: string } | "settings" | null
  >();

  const [isSaving, setIsSaving] = useState(false);
  const [availableChecklists, setAvailableChecklists] = useState<Checklist[]>(
    []
  );

  const selectedChecklist =
      availableChecklists?.find((c) => {
        if (
          visibleSection &&
          typeof visibleSection === "object" &&
          "checklistId" in visibleSection
        ) {
          return c.id === visibleSection?.checklistId;
        }
      }) ||
    null;

  const setSelectedChecklist = (c: Checklist) => {
    setLastSelectedChecklistId(c.id);
    setVisibleSection({ checklistId: c.id });
  };

  useEffect(() => {
    setAvailableChecklists(onboardingList);
    setSelectedChecklist(onboardingList[0]);
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

  const handleAddNewChecklist = () => {
      const newChecklistId = Date.now().toString();
      handleAddChecklist({
        id: newChecklistId,
        name: "Check deez nuts " + getRandomEmoji(),
        items: [],
      })
      setVisibleSection({editChecklistId: newChecklistId})
  }

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
    handleAddNewChecklist,
    setLastSelectedChecklistId,
  };
};
