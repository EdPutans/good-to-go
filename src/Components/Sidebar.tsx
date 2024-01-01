import React, { PropsWithChildren } from "react";
import { Animated, Easing } from "react-native";
import { Drawer, IconButton, Surface } from "react-native-paper";
// import { useSection } from "./Navigator";

type SidebarProps = PropsWithChildren<{
  isVisible: boolean;
  handleHide: () => void;
  width?: number;
}> &
  ReturnType<typeof useSection>;

export const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  handleHide,
  children,
  width = 250,
  setVisibleSection,
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
    outputRange: [-width, 0],
  });

  return (
    <Animated.View
      style={{
        width: width,
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        transform: [{ translateX: sidebarTranslateX }],
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
              setVisibleSection("settings");
            }}
          />
        </Drawer.Section>
      </Surface>
    </Animated.View>
  );
};
