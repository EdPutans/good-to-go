import React, { useState } from "react";

import { FlatList } from "react-native";
import { Button, Card, Checkbox, FAB, Text } from "react-native-paper";
import { Checklist } from "../types";
import Modal from "./Modal";

type Props = {
  checklist: Checklist | null;
  handleCheckItem: (cid: Checklist["id"], id: string) => void;
  handleClearAll: () => void;
  handleAddIfNoneAvailable: () => void;
};

const ChecklistScreen = ({
  checklist,
  handleCheckItem,
  handleClearAll,
  handleAddIfNoneAvailable,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  if (!checklist) return null;

  return (
    <>
      <FlatList
        data={checklist.items}
        renderItem={({ item }) => (
          <Checkbox.Item
            rippleColor={"rgba(0, 0, 0, 0)"} // disabled ripple effect
            style={{ flexDirection: "row-reverse" }}
            label={item.name}
            key={item.id}
            status={item.checked ? "checked" : "unchecked"}
            onPress={() => handleCheckItem(checklist.id, item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Card>
            <Card.Title title="Oops, no checklists to check!" />
            <Card.Actions>
              <Text>Try adding one</Text>
              <Button onPress={handleAddIfNoneAvailable}>
                <Text>Here</Text>
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
      <Modal
        open={isModalOpen}
        title="Are you sure?"
        content="All items will be marked as cleared"
        okProps={{
          onPress: () => {
            setIsModalOpen(false);
            handleClearAll();
          },
          label: "Yes, clear all",
        }}
        cancelProps={{
          onPress: () => setIsModalOpen(false),
          label: "No, go back",
        }}
      />
      <FAB
        style={{
          position: "absolute",
          margin: 16,
          right: 0,
          bottom: 0,
        }}
        icon="check-all"
        onPress={() => setIsModalOpen(true)}
      />
    </>
  );
};

export default ChecklistScreen;
