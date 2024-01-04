import React, { useEffect, useState } from "react";

import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, FAB, Text } from "react-native-paper";
import { Checklist } from "../types";
import Modal from "./Modal";

type Props = {
  checklist: Checklist | null;
  handleCheckItem: (cid: Checklist["id"], id: string) => void;
  handleClearAll?: () => void;
  handleAddIfNoneAvailable: () => void;
  handleEditBrokenChecklist: () => void;
  availableChecklists: Checklist[];
  setSelectedChecklist: (checklist: Checklist) => void;
};

const ListComponent = ({ checklist, getHandleCheckFinal }) => (
  <>
    {checklist?.items.map((item) => (
      <Checkbox.Item
        key={item.id}
        rippleColor={"rgba(0, 0, 0, 0)"} // disabled ripple effect
        style={{ flexDirection: "row-reverse" }}
        label={item.name || "Unnamed checklist"}
        status={item.checked ? "checked" : "unchecked"}
        onPress={getHandleCheckFinal(item)}
      />
    ))}
  </>
);

const ChecklistScreen = (props: Props) => {
  const {
    checklist,
    handleCheckItem,
    availableChecklists,
    handleClearAll,
    handleAddIfNoneAvailable,
    handleEditBrokenChecklist,
    setSelectedChecklist,
  } = props;
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

  const UnselectedChecklistComponent = () => (
    <Card style={{ margin: 20 }}>
      <Card.Title title="Oops!" />
      <Card.Content>
        <Text variant="bodyLarge">
          You forgot to select a checklist, silly! You can do that in the
          sidebar. Click the 🍔 at the top to see the list
        </Text>
      </Card.Content>
    </Card>
  );

  const NoChecklistsComponent = () => (
    <Card style={{ margin: 20 }}>
      <Card.Title title="Oops!" />
      <Card.Content>
        <Text variant="bodyLarge">
          You have no checklists to check! (or you forgot to select one 🐈){" "}
          {`\n`}
        </Text>
        <Text variant="bodyLarge">Try adding one or check the menu</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained-tonal" onPress={handleAddIfNoneAvailable}>
          <Text>Add a checklist</Text>
        </Button>
      </Card.Actions>
    </Card>
  );
  const NoItemsComponent = () => (
    <Card style={{ margin: 20 }}>
      <Card.Title title="Oops, you have no items to check!" />
      <Card.Content>
        <Text>You can fix that</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained-tonal" onPress={handleEditBrokenChecklist}>
          <Text>Here</Text>
        </Button>
      </Card.Actions>
    </Card>
  );

  useEffect(() => {
    if (availableChecklists?.length > 0 && !checklist) {
      setSelectedChecklist(availableChecklists[0]);
    }
  }, [availableChecklists, checklist]);
  // const Content = React.useMemo(() => {
  //   // if (availableChecklists?.length > 0 && !checklist) {
  //   //   return UnselectedChecklistComponent;
  //   // }
  //   if (!availableChecklists?.length) {
  //     return NoChecklistsComponent;
  //   }
  //   if (
  //   }

  //   return ListComponent;
  // }, [checklist, availableChecklists]);

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        justifyContent: "center",
      }}
    >
      <ScrollView
        style={{
          overflow: "scroll",
          flex: 1,
          height: "100%",
        }}
      >
        {!availableChecklists?.length && <NoChecklistsComponent />}
        {!!availableChecklists?.length && !checklist?.items?.length && (
          <NoItemsComponent />
        )}
        {checklist && (
          <ListComponent
            checklist={checklist}
            getHandleCheckFinal={getHandleCheckFinal}
          />
        )}
      </ScrollView>
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
