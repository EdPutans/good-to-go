import React from "react";
import { Appbar, Drawer, Text } from "react-native-paper";
import Main from "..";
import { Checklist } from "../types";
import EditChecklist from "./EditChecklist";
import ManageChecklists from "./ManageChecklists";
import { Sidebar } from "./Sidebar";
import { ThemeTest } from "./ThemeTest";
import { useChecklistState } from "./hooks";

export function Navigator() {
  const handlers = useChecklistState();

  const { availableChecklists, visibleSection, setVisibleSection } = handlers;

  const getEditChecklistComp = (checklist: Checklist) => (props: any) =>
    <EditChecklist checklist={checklist} {...handlers} {...props} />;

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
          checklists={availableChecklists}
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

      return <Main {...props} checklist={props.selectedChecklist} />;
    }
    // if (!props.selectedChecklist) return null;
    // return <Main {...props} checklist={props.selectedChecklist} />;
    // }
  };

  const showAppBar = React.useMemo(() => {
    if (!visibleSection) return false;
    if (visibleSection === "settings") return true;
    else if (visibleSection && "editChecklistId" in visibleSection) {
      return false;
    } else if (visibleSection && "checklistId" in visibleSection) {
      return true;
    }
  }, [visibleSection]);

  return (
    <>
      {showAppBar && (
        <Appbar>
          <Appbar.Action
            icon="menu"
            onPress={() => setShowSidebar((prev) => !prev)}
          />
          <Appbar.Content title={props.selectedChecklist?.name || "Settings"} />
        </Appbar>
      )}
      <ThemeTest />
      <RenderContent />
      <Sidebar
        setVisibleSection={setVisibleSection}
        visibleSection={visibleSection}
        // {...props}
        isVisible={showSidebar}
        handleHide={() => setShowSidebar(false)}
      >
        {availableChecklists.map((checklist) => (
          <Drawer.Item
            key={checklist.id}
            label={checklist.name}
            onPress={() => {
              props.setSelectedChecklist(checklist);
              setVisibleSection({ checklistId: checklist.id });
              setShowSidebar(false);
            }}
          />
        ))}
      </Sidebar>
    </>
  );

  // return (
  //   <DrawerThing.Navigator defaultStatus="open">
  //     {availableChecklists.map((checklist) => (
  //       <React.Fragment key={checklist.id}>
  //         <DrawerThing.Screen
  //           // getComponent={() => getMainComp(checklist)}
  //           component={(props: any) => (
  //             <Main checklist={checklist} {...handlers} {...props} />
  //           )}
  //           navigationKey={checklist.id}
  //           name={`checklist-${checklist.id}`}
  //           options={{ title: checklist.name }}
  //           // component={getMainComp(checklist)}
  //           key={checklist.id}
  //         />
  //         <DrawerThing.Screen
  //           name={`edit-checklist-${checklist.id}`}
  //           options={{ title: `Edit ` + checklist.name }}
  //           component={getEditChecklistComp(checklist)}
  //         />
  //       </React.Fragment>
  //     ))}

  //     <DrawerThing.Group>
  //       <DrawerThing.Screen
  //         options={{ title: "Settings" }}
  //         name={"settings"}
  //         component={(props: any) => (
  //           <ManageChecklists
  //             checklists={availableChecklists}
  //             {...handlers}
  //             {...props}
  //           />
  //         )}
  //       />
  //     </DrawerThing.Group>
  //   </DrawerThing.Navigator>
  // );
}
