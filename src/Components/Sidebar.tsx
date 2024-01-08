import React, { PropsWithChildren, useEffect } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  Easing,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Drawer, IconButton, Surface } from "react-native-paper";
import { useChecklistState } from "./hooks";

type SidebarProps = PropsWithChildren<{
  isVisible: boolean;
  handleHide: () => void;
  width?: number;
}> &
  Pick<
    ReturnType<typeof useChecklistState>,
    "setVisibleSection" | "visibleSection"
  >;

export const Sidebar: React.FC<SidebarProps> = ({
  isVisible,
  handleHide,
  children,
  width = 250,
  setVisibleSection,
}) => {
  const sidebarAnimation = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const handleFake = () => {
      handleHide();
      return true;
    };
    if (isVisible) {
      BackHandler.addEventListener("hardwareBackPress", handleFake);
    } else {
      BackHandler.removeEventListener("hardwareBackPress", handleFake);
    }
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleFake);
    };
  }, [handleHide, isVisible]);

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
  const windowWidth = Dimensions.get("window").width;

  const sidebarTranslateX = sidebarAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-windowWidth, 0],
  });

  return (
    <Animated.View
      style={{
        width: windowWidth,
        height: "100%",
        position: "absolute",
        flex: 1,
        flexDirection: "row",
        top: 0,
        left: 0,
        transform: [{ translateX: sidebarTranslateX }],
      }}
    >
      <Surface style={{ width: width }}>
        <IconButton
          style={{ alignSelf: "flex-end" }}
          icon="chevron-left"
          onPress={handleHide}
        ></IconButton>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <View>{children}</View>
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
        </View>
      </Surface>
      <TouchableWithoutFeedback onPress={handleHide}>
        <View style={{ flex: 1 }} />
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};
