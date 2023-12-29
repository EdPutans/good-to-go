import React from "react";
import { ScrollView, View } from "react-native";
import { Checkbox, Text } from "react-native-paper";
import { Checklist } from "../types";

type Props = {
  checklist: Checklist | null;
  handleCheckItem: (id: string) => void;
};

const ChecklistScreen = ({ checklist, handleCheckItem }: Props) => {
  if (!checklist) return null;

  return (
    <ScrollView style={{ flex: 1, width: "100%" }}>
      <Text variant="displayLarge">{checklist.name}</Text>
      <View>
        {checklist.items.map((item) => (
          <Checkbox.Item
            style={{ flexDirection: "row-reverse" }}
            label={item.name}
            key={item.id}
            status={item.checked ? "checked" : "unchecked"}
            onPress={() => handleCheckItem(item.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default ChecklistScreen;
