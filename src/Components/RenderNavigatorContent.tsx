import { ActivityIndicator, Appbar } from "react-native-paper";
import ChecklistScreen from "./ChecklistScreen";
import EditChecklist from "./EditChecklist";
import ManageChecklists from "./ManageChecklists";
import { useChecklistState } from "./hooks";

export const RenderContent = (
  props: ReturnType<typeof useChecklistState> & {
    showSidebar: boolean;
    setShowSidebar: any;
  }
) => {
  if (props.isLoading)
    return <ActivityIndicator style={{ height: "100%" }} size={64} />;

  if (props.visibleSection === "settings")
    return (
      <ManageChecklists
        handleBack={() =>
          props.setVisibleSection({
            checklistId: props.lastSelectedChecklistId,
          })
        }
        handleSaveChecklist={(id) => {
          if (props.availableChecklists[0]) {
            props.setLastSelectedChecklistId(props.availableChecklists[0].id);
          }
          props.handleSaveChecklist(id);
        }}
        checklists={props.availableChecklists}
        handleAddChecklist={props.handleAddNewChecklist}
        handleRemoveChecklist={props.handleRemoveChecklist}
        handleClickManageChecklist={(id: string) => {
          props.setVisibleSection({ editChecklistId: id });
        }}
      />
    );
  else if (props.visibleSection && "editChecklistId" in props.visibleSection) {
    const id = props.visibleSection.editChecklistId;
    const checklist = props.availableChecklists.find((c) => c.id === id);
    if (!checklist) return null;
    return (
      <EditChecklist
        handleRemoveChecklist={props.handleRemoveChecklist}
        checklist={checklist}
        handleSaveChecklist={props.handleSaveChecklist}
        handleBack={() => props.setVisibleSection("settings")}
      />
    );
  }

  const id = props.lastSelectedChecklistId;
  const checklist = props.availableChecklists.find((c) => c.id === id);

  return (
    <>
      <Appbar style={{ marginTop: 0 }}>
        <Appbar.Action
          icon="menu"
          onPress={() => props.setShowSidebar((prev) => !prev)}
        />
        <Appbar.Content title={props.selectedChecklist?.name || ""} />
      </Appbar>
      <ChecklistScreen
        {...props}
        handleEditBrokenChecklist={() =>
          props.setVisibleSection({ editChecklistId: id })
        }
        availableChecklists={props.availableChecklists}
        checklist={props.selectedChecklist}
        handleClearAll={
          checklist
            ? () => props.handleClearAllCheckboxes(checklist.id)
            : undefined
        }
        setSelectedChecklist={props.setSelectedChecklist}
        handleAddIfNoneAvailable={props.handleAddNewChecklist}
        handleCheckItem={props.handleCheckItem}
      />
    </>
  );
};
