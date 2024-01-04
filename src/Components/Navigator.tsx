import React from "react";
import { Drawer } from "react-native-paper";
import { Sidebar } from "./Sidebar";

import { StatusBar, View } from "react-native";
import FirstVisitModal from "./FirstVisitModal";
import { RenderContent } from "./RenderNavigatorContent";
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

  const h = StatusBar.currentHeight;
  return (
    <>
      <View style={{ marginTop: h, flex: 1 }}>
        <RenderContent
          {...props}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />

        <FirstVisitModal firstLoadCallback={props.firstLoadCallback} />
      </View>
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
    </>
  );
}
