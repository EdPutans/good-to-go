import React from "react";
import { Appbar, Drawer, Text } from "react-native-paper";
import EditChecklist from "./EditChecklist";
import ManageChecklists from "./ManageChecklists";
import { Sidebar } from "./Sidebar";

import ChecklistScreen from "./ChecklistScreen";
import FirstVisitModal from "./FirstVisitModal";
import { useChecklistState } from "./hooks";

export function Navigator() {
  const handlers = useChecklistState();

  const { availableChecklists, visibleSection, setVisibleSection } = handlers;
  const [showSidebar, setShowSidebar] = React.useState(false);

  const props = {
    ...handlers,
    showSidebar,
    setShowSidebar,
  };

  const RenderContent = () => {
    if (!visibleSection) return <Text>Nothing to see here 🤷🏻‍♀️</Text>;
    if (visibleSection === "settings")
      return (
        <ManageChecklists
          handleBack={() =>
            setVisibleSection({ checklistId: props.lastSelectedChecklistId })
          }
          checklists={availableChecklists}
          handleAddChecklist={() => {
            const newChecklistId = Date.now().toString();
            props.handleAddChecklist({
              id: newChecklistId,
              name: "Check deez nuts 😍",
              items: [],
            });
            setVisibleSection({ editChecklistId: newChecklistId });
          }}
          handleRemoveChecklist={props.handleRemoveChecklist}
          handleClickManageChecklist={(id: string) => {
            setVisibleSection({ editChecklistId: id });
          }}
        />
      );
    else if (visibleSection && "editChecklistId" in visibleSection) {
      const id = visibleSection.editChecklistId;
      const checklist = availableChecklists.find((c) => c.id === id);

      if (!checklist) return null;

      return (
        <EditChecklist
          checklist={checklist}
          handleSaveChecklist={props.handleSaveChecklist}
          handleBack={() => setVisibleSection("settings")}
        />
      );
    } else if (visibleSection && "checklistId" in visibleSection) {
      const id = visibleSection.checklistId;
      const checklist = availableChecklists.find((c) => c.id === id);

      if (!checklist) return null;

      return (
        <>
          <Appbar>
            <Appbar.Action
              icon="menu"
              onPress={() => setShowSidebar((prev) => !prev)}
            />
            <Appbar.Content
              title={props.selectedChecklist?.name || "Settings"}
            />
          </Appbar>
          <ChecklistScreen
            {...props}
            checklist={props.selectedChecklist}
            handleClearAll={() => props.handleClearAllCheckboxes(checklist.id)}
            handleAddIfNoneAvailable={() => props.setVisibleSection("settings")}
            handleCheckItem={props.handleCheckItem}
          />
        </>
      );
    }
  };

  return (
    <>
      <RenderContent />
      <Sidebar
        setVisibleSection={setVisibleSection}
        visibleSection={visibleSection}
        isVisible={showSidebar}
        handleHide={() => setShowSidebar(false)}
      >
        {availableChecklists.map((checklist) => (
          <Drawer.Item
            key={checklist.id}
            label={checklist.name}
            onPress={() => {
              setShowSidebar(false);
              props.setSelectedChecklist(checklist);
            }}
          />
        ))}
      </Sidebar>
      <FirstVisitModal />
    </>
  );
}
