import React from "react";
import { ScrollView } from "react-native";
import { Checkbox } from "react-native-paper";
import { Checklist } from "../types";

type Props = {
  checklist: Checklist | null;
  handleCheckItem: (id: string) => void;
};

const ChecklistScreen = ({ checklist, handleCheckItem }: Props) => {
  if (!checklist) return null;

  return (
    <ScrollView style={{ flex: 1, width: "100%" }}>
      {checklist.items.map((item) => (
        <Checkbox.Item
          style={{ flexDirection: "row-reverse" }}
          label={item.name}
          key={item.id}
          status={item.checked ? "checked" : "unchecked"}
          onPress={() => handleCheckItem(item.id)}
        />
      ))}
    </ScrollView>
  );
};

export default ChecklistScreen;
