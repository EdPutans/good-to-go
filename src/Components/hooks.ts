import AsyncStorage from "@react-native-async-storage/async-storage";
import { isEqual } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { Checklist } from "../types";
import { onboardingList } from "./FirstLoadSampleList";
import { localStorage } from "./storage";

const listOfEmojis: string[] = [
  "🍕",
  "🍔",
  "🍟",
  "🍗",
  "🥩",
  "🥓",
  "🍖",
  "🌭",
  "🍿",
  "🧂",
  "🥚",
  "🍳",
  "🥞",
  "🧇",
  "🥓",
  "🥯",
  "🥨",
  "🥐",
  "🍞",
  "🥖",
  "🥪",
  "🌮",
  "🌯",
  "🥙",
  "🧆",
  "🥘",
  "🥫",
  "🍝",
  "🍜",
  "🍲",
  "🍛",
  "🍣",
  "🍱",
  "🥟",
  "🦪",
  "🍤",
  "🍙",
  "🍚",
  "🍘",
  "🍥",
  "🥠",
  "🥮",
  "🍢",
  "🍡",
  "🍧",
  "🍨",
  "🍦",
  "🥧",
  "🧁",
  "🍰",
  "🎂",
  "🍮",
  "🍭",
  "🍬",
  "🍫",
  "🍿",
  "🍩",
  "🍪",
  "🌰",
  "🥜",
  "🍯",
  "🥛",
  "🍼",
  "☕️",
  "🍵",
  "🧃",
  "🥤",
  "🍶",
  "🍺",
  "🍻",
  "🥂",
  "🍷",
  "🥃",
  "🍸",
  "🍹",
  "🍾",
  "🧉",
  "🧊",
  "🥄",
  "🍴",
  "🍽",
  "🥣",
  "🥡",
  "🥢",
  "🧂",
  "🧈",
  "🍽",
  "🍴",
  "🥄",
  "🥣",
  "🥡",
  "🥢",
  "🧂",
  "🧈",
  "🍽",
  "🍴",
  "🥄",
  "🥣",
  "🥡",
  "🥢",
  "🗿",
];
export const getRandomEmoji = () => {
  return listOfEmojis[Math.floor(Math.random() * listOfEmojis.length)];
};

export const useChecklistState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [lastSelectedChecklistId, setLastSelectedChecklistId] = useState<
    string | null
  >(null);

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
    }) || null;

  const setSelectedChecklist = (c: Checklist) => {
    setLastSelectedChecklistId(c.id);
    localStorage.setCurrentlySelectedChecklistId(c.id);
    setVisibleSection({ checklistId: c.id });
  };

  // experimental, remove?
  const prevAvChecklists = usePrevious(availableChecklists);
  useEffect(() => {
    if (
      visibleSection &&
      typeof visibleSection === "object" &&
      "checklistId" in visibleSection
    ) {
      if (
        !availableChecklists.find((c) => c.id === visibleSection.checklistId)
      ) {
        if (isEqual(prevAvChecklists, availableChecklists)) return;
        if (!availableChecklists.length) return;

        setVisibleSection({ checklistId: availableChecklists[0].id });
      }
    }
  }, [visibleSection, availableChecklists]);

  const firstLoadCallback = async () => {
    setIsLoading(true);
    Promise.all([
      AsyncStorage.setItem("isntFirstVisit", "whatever"),
      localStorage.setAvailableChecklists(onboardingList),
      localStorage.setCurrentlySelectedChecklistId(onboardingList[0].id),
    ]).then(() => {
      setAvailableChecklists(onboardingList);
      setVisibleSection({ checklistId: onboardingList[0].id });
      setSelectedChecklist(onboardingList[0]);
      setIsLoading(false);
    });
  };

  const init = async () => {
    const getAvailables = async () =>
      localStorage.getAvailableChecklists().then((checklists) => {
        if (!checklists) {
          console.error("No checklists found in local storage");
          return;
        }
        setAvailableChecklists(checklists);
      });

    const getId = async () =>
      localStorage.getCurrentlySelectedChecklistId().then((id) => {
        if (!id) {
          console.error("No checklist id found in local storage");
          return;
        }

        setLastSelectedChecklistId(id);
        setVisibleSection({ checklistId: id });
      });

    getAvailables();
    getId();
  };

  useEffect(() => {
    init();
  }, []);

  const handleCheckItem = (checklistId: string, itemId: string) => {
    setAvailableChecklists((prevChecklists) => {
      const val = prevChecklists.map((checklist) => {
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
      localStorage.setAvailableChecklists(val);
      return val;
    });
  };

  const handleSaveChecklist = (checklist: Checklist) => {
    setIsSaving(true);
    const replaceCh = availableChecklists.findIndex(
      (c) => c.id === checklist.id
    );

    if (replaceCh !== -1) {
      setAvailableChecklists((prevChecklists) => {
        const val = [...prevChecklists];
        val[replaceCh] = checklist;
        localStorage.setAvailableChecklists(val);
        return val;
      });
    } else {
      setAvailableChecklists((prevChecklists) => {
        const val = [...prevChecklists, checklist];
        localStorage.setAvailableChecklists(val);
        return val;
      });
    }

    localStorage.setAvailableChecklists(availableChecklists);
    setIsSaving(false);
  };

  const handleAddChecklist = (checklist: Checklist) => {
    setAvailableChecklists((prevChecklists) => {
      const val = [...prevChecklists, checklist];
      localStorage.setAvailableChecklists(availableChecklists);
      return val;
    });
  };
  const handleAddNewChecklist = () => {
    const newChecklistId = Date.now().toString();
    handleAddChecklist({
      id: newChecklistId,
      name: "Check deez nuts " + getRandomEmoji(),
      items: [],
    });
    setVisibleSection({ editChecklistId: newChecklistId });
  };

  const handleRemoveChecklist = (checklistId: string) => {
    setAvailableChecklists((prevChecklists) => {
      const val = prevChecklists.filter((c) => c.id !== checklistId);
      localStorage.setAvailableChecklists(val);
      return val;
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
    firstLoadCallback,
    setLastSelectedChecklistId,
    isLoading,
  };
};

const usePrevious = <T extends unknown>(value: T) => {
  const currentRef = useRef<T>(value);
  const previousRef = useRef<T>();
  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }
  return previousRef.current;
};
