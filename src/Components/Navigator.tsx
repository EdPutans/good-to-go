import React from "react";
import { Appbar, Drawer } from "react-native-paper";
import ManageChecklists from "./ManageChecklists";
import { Sidebar } from "./Sidebar";

import { setStatusBarHidden } from "expo-status-bar";
import ChecklistScreen from "./ChecklistScreen";
import EditChecklist from "./EditChecklist";
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
    if (visibleSection === "settings")
      return (
        <ManageChecklists
          handleBack={() =>
            setVisibleSection({ checklistId: props.lastSelectedChecklistId })
          }
          handleSaveChecklist={props.handleSaveChecklist}
          checklists={availableChecklists}
          handleAddChecklist={props.handleAddNewChecklist}
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
          handleRemoveChecklist={props.handleRemoveChecklist}
          checklist={checklist}
          handleSaveChecklist={props.handleSaveChecklist}
          handleBack={() => setVisibleSection("settings")}
        />
      );
    } else {
      const id = props.lastSelectedChecklistId;
      const checklist = availableChecklists.find((c) => c.id === id);
      setStatusBarHidden(true, "slide");

      return (
        <>
          <Appbar style={{ marginTop: 0 }}>
            <Appbar.Action
              icon="menu"
              onPress={() => setShowSidebar((prev) => !prev)}
            />
            <Appbar.Content
              title={props.selectedChecklist?.name || "🤷🏻‍♀️ Nothing here"}
            />
          </Appbar>
          <ChecklistScreen
            {...props}
            handleEditBrokenChecklist={() =>
              setVisibleSection({ editChecklistId: id })
            }
            availableChecklists={availableChecklists}
            checklist={props.selectedChecklist}
            handleClearAll={
              checklist
                ? () => props.handleClearAllCheckboxes(checklist.id)
                : undefined
            }
            handleAddIfNoneAvailable={props.handleAddNewChecklist}
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
            icon={"check"}
            key={checklist.id}
            label={checklist.name}
            style={{ width: "100%" }}
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
