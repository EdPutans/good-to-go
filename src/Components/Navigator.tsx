import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { PropsWithChildren } from "react";
import { Appbar, Drawer, IconButton, Surface } from "react-native-paper";
import Main from "..";
import { Checklist } from "../types";
import EditChecklist from "./EditChecklist";
import ManageChecklists from "./ManageChecklists";
import { useChecklistState } from "./hooks";

const DrawerThing = createDrawerNavigator();
const Hidden = createNativeStackNavigator();

const useSection = () => {
  const [visibleSection, setVisibleSection] = React.useState<
    `checklist-${string}` | `edit-checklist-${string}` | "settings" | null
  >(null);

  return { visibleSection, setVisibleSection };
};

export function Navigator() {
  const handlers = useChecklistState();

  const { availableChecklists } = handlers;

  const getEditChecklistComp = (checklist: Checklist) => (props: any) =>
    <EditChecklist checklist={checklist} {...handlers} {...props} />;

  const [showSidebar, setShowSidebar] = React.useState(false);

  const { visibleSection, setVisibleSection } = useSection();

  const props = {
    ...handlers,
    visibleSection,
    setVisibleSection,
    showSidebar,
    setShowSidebar,
  };

  const RenderContent = () => {
    switch (visibleSection) {
      case "settings":
        return <ManageChecklists {...props} />;
      case "edit-checklist-":
        if (!props.selectedChecklist) return null;
        <EditChecklist checklist={props.selectedChecklist} {...props} />;
      case "checklist-":
      default:
        if (!props.selectedChecklist) return null;
        return <Main {...props} checklist={props.selectedChecklist} />;
    }
  };

  if (new Date())
    return (
      <>
        <Appbar>
          <Appbar.Action
            icon="menu"
            onPress={() => setShowSidebar((prev) => !prev)}
          />
          <Appbar.Content title={props.selectedChecklist?.name} />
        </Appbar>
        <RenderContent />
        <Sidebar
          isVisible={showSidebar}
          handleHide={() => setShowSidebar(false)}
        >
          {availableChecklists.map((checklist) => (
            <Drawer.Item
              key={checklist.id}
              label={checklist.name}
              onPress={() => {
                setVisibleSection(`checklist-${checklist.id}`);
                setShowSidebar(false);
              }}
            />
          ))}
        </Sidebar>
      </>
    );

  if (!availableChecklists?.length) return null;

  return (
    <DrawerThing.Navigator defaultStatus="open">
      {availableChecklists.map((checklist) => (
        <React.Fragment key={checklist.id}>
          <DrawerThing.Screen
            // getComponent={() => getMainComp(checklist)}
            component={(props: any) => (
              <Main checklist={checklist} {...handlers} {...props} />
            )}
            navigationKey={checklist.id}
            name={`checklist-${checklist.id}`}
            options={{ title: checklist.name }}
            // component={getMainComp(checklist)}
            key={checklist.id}
          />
          <DrawerThing.Screen
            name={`edit-checklist-${checklist.id}`}
            options={{ title: `Edit ` + checklist.name }}
            component={getEditChecklistComp(checklist)}
          />
        </React.Fragment>
      ))}

      <DrawerThing.Group>
        <DrawerThing.Screen
          options={{ title: "Settings" }}
          name={"settings"}
          component={(props: any) => (
            <ManageChecklists
              checklists={availableChecklists}
              {...handlers}
              {...props}
            />
          )}
        />
      </DrawerThing.Group>
    </DrawerThing.Navigator>
  );
}

import { Animated, Easing } from "react-native";

type SidebarProps = PropsWithChildren<{
  isVisible: boolean;
  handleHide: () => void;
}>;

const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  handleHide,
  children,
}) => {
  const sidebarAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(sidebarAnimation, {
        toValue: 1,
        duration: 200,
        easing: Easing.bezier(0.22, 0.01, 0.1, 0.99), // Bezier curve animation
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sidebarAnimation, {
        toValue: 0,
        duration: 200,
        easing: Easing.bezier(0.42, 0, 0.58, 1), // Bezier curve animation
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const sidebarTranslateX = sidebarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 0],
  });

  return (
    <Animated.View
      style={{
        width: 250,
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        // backgroundColor: "white",
        transform: [{ translateX: sidebarTranslateX }],
        // transition: "transform 0.3s ease-in-out",
        // transform: isVisible ? "translateX(0)" : "translateX(-100%)",
      }}
    >
      <Surface style={{ flex: 1 }}>
        <IconButton icon="close" onPress={handleHide}></IconButton>
        <Drawer.Section>{children}</Drawer.Section>
        <Drawer.Section>
          <Drawer.Item
            icon="cog"
            label="Settings"
            onPress={() => {
              handleHide();
              // setVisibleSection("settings");
            }}
          />
        </Drawer.Section>
      </Surface>
    </Animated.View>
  );
};
