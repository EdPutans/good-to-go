import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Button, Dialog, Text } from "react-native-paper";

type Props = {
  firstLoadCallback: () => void;
};

const FirstVisitModal = ({ firstLoadCallback }: Props) => {
  const [firstVisit, setFirstVisit] = React.useState(false);

  const dismiss = () => {
    setFirstVisit(false);
  };

  const getIsNotFirstVisit = async () => {
    const isntFirstVisit = await AsyncStorage.getItem("isntFirstVisit");
    if (isntFirstVisit) return;
    firstLoadCallback();

    setFirstVisit(true);
  };

  useEffect(() => {
    getIsNotFirstVisit();
  }, []);

  if (!firstVisit) return null;

  return (
    <Dialog
      style={{ zIndex: 999 }}
      visible={true}
      onDismiss={dismiss}
      dismissable={false}
    >
      <Dialog.Icon icon="hand-wave-outline" />
      <Dialog.Title>Welcome to Checkmate!</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
          This is a checklist app that helps you keep track of your daily tasks.
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
          Unlike a todo-list, use this app to set up recurring lists and use
          when needed. Think pre-flight checklists, or a list of things to do
          before you leave the house.
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
          I've created a few examples, you are welcome to create your own in the
          settings tab.
        </Text>
        <Text variant="bodyMedium" style={{ marginBottom: 10 }}>
          Enjoy!
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={dismiss}>
          <Text variant="labelMedium">Cool, cheers</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default FirstVisitModal;
