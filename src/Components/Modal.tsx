import React from "react";
import { Button, Dialog, Text, useTheme } from "react-native-paper";

type Props = {
  open: boolean;

  title: string;
  okProps?: {
    label: string;
    onPress: () => void;
  };
  cancelProps?: {
    label: string;
    onPress: () => void;
  };
  content?: string;
  invertCTA?: boolean;
};

const Modal = ({
  open,

  title,
  okProps,
  cancelProps,
  content,
  invertCTA,
}: Props) => {
  const { primaryContainer, secondaryContainer } = useTheme().colors;

  return (
    <Dialog visible={open} onDismiss={cancelProps?.onPress}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{content}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          buttonColor={!invertCTA ? secondaryContainer : undefined}
          onPress={cancelProps?.onPress}
        >
          <Text variant="labelMedium">{cancelProps?.label}</Text>
        </Button>
        <Button
          onPress={okProps?.onPress}
          buttonColor={invertCTA ? secondaryContainer : undefined}
        >
          <Text variant="labelMedium">{okProps?.label}</Text>
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default Modal;
