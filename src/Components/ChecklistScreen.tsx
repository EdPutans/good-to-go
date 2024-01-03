import React, { useEffect, useState } from "react";

import { FlatList, View } from "react-native";
import { Button, Card, Checkbox, FAB, Text } from "react-native-paper";
import { Checklist } from "../types";
import Modal from "./Modal";

type Props = {
  checklist: Checklist | null;
  handleCheckItem: (cid: Checklist["id"], id: string) => void;
  handleClearAll?: () => void;
  handleAddIfNoneAvailable: () => void;
};

const ChecklistScreen = ({
  checklist,
  handleCheckItem,
  handleClearAll,
  handleAddIfNoneAvailable,
}: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getHandleCheckFinal = (item: Checklist["items"][number]) => {
    if (!checklist) return undefined;

    return () => handleCheckItem(checklist?.id, item.id);
  };

  const [hasProvoked, setHasProvoked] = useState(false);
  useEffect(() => {
    if (!checklist?.items?.length) return;
    if (hasProvoked) return;
    if (checklist.items.every((i) => i.checked)) {
      setIsModalOpen(true);
      setHasProvoked(true);
    }
  }, [hasProvoked, checklist]);

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
      }}
    >
      <FlatList
        style={{ flex: 1, height: "100%" }}
        data={checklist?.items || []}
        renderItem={({ item }) => {
          if (!item) return null;
          return (
            <Checkbox.Item
              rippleColor={"rgba(0, 0, 0, 0)"} // disabled ripple effect
              style={{ flexDirection: "row-reverse" }}
              label={item.name}
              key={item.id}
              status={item.checked ? "checked" : "unchecked"}
              onPress={getHandleCheckFinal(item)}
            />
          );
        }}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <Card style={{ margin: 10, marginTop: 30 }}>
            <Card.Title title="Oops, you have no checklists to check!" />
            <Card.Content>
              <Text>Try adding one</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained-tonal" onPress={handleAddIfNoneAvailable}>
                <Text>Here</Text>
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
      <Modal
        open={isModalOpen}
        title="Nice one!"
        content="Would you like to clear the list? All items will be marked as cleared"
        okProps={{
          onPress: () => {
            setIsModalOpen(false);
            // impossible ;)
            // @ts-ignore
            handleClearAll();
          },
          label: "Yes, clear all",
        }}
        cancelProps={{
          onPress: () => setIsModalOpen(false),
          label: "No, go back",
        }}
      />
      {handleClearAll && (
        <FAB
          // size="medium"
          customSize={58}
          style={{
            position: "absolute",
            margin: 16,
            right: 0,
            bottom: 0,
          }}
          icon="check-all"
          onPress={() => setIsModalOpen(true)}
        />
      )}
    </View>
  );
};

export default ChecklistScreen;
