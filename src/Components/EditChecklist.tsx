import isEqual from "lodash/isEqual";
import React, { useEffect, useRef } from "react";
import { Keyboard, ScrollView, View } from "react-native";
import {
  Appbar,
  Card,
  FAB,
  IconButton,
  TextInput,
  Tooltip,
  useTheme,
} from "react-native-paper";
import { Checklist } from "../types";
import Modal from "./Modal";
import { useKeyboardStateListener } from "./utils";

type Props = {
  checklist: Checklist;
  handleSaveChecklist: (checklist: Checklist) => void;
  handleBack: () => void;
};

const useEditChecklist = (checklist: Checklist) => {
  const [editedChecklist, setEditedChecklist] =
    React.useState<Checklist>(checklist);
  const isAddDisabled = editedChecklist.items.some((item) => !item.name);
  const getHandleAdd = () => {
    if (isAddDisabled) return undefined;

    return () => {
      setEditedChecklist((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            id: Date.now().toString(),
            name: "",
            checked: false,
          },
        ],
      }));
    };
  };

  const handleRemove = (itemId: string) => {
    setEditedChecklist((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleEdit = (itemId: string, value: string) => {
    setEditedChecklist((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, name: value } : item
      ),
    }));
  };
  return {
    editedChecklist,
    setEditedChecklist,
    isAddDisabled,
    getHandleAdd,
    handleRemove,
    handleEdit,
  };
};

const EditChecklist = (props: Props) => {
  const {
    editedChecklist,
    setEditedChecklist,
    isAddDisabled,
    getHandleAdd,
    handleRemove,
    handleEdit,
  } = useEditChecklist(props.checklist);

  const theme = useTheme().colors.background;
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const onClickBack = () => {
    if (isEqual(editedChecklist, props.checklist)) {
      props.handleBack();
      if (!props.checklist.name || !props.checklist.items.length) {
      }
      return;
    }

    setIsModalVisible(true);
  };

  const { keyboardState } = useKeyboardStateListener();
  const isSaveDisabled = !editedChecklist.name || !editedChecklist.items.length;
  const isPlusFabVisible =
    editedChecklist.items.length > 0 && keyboardState === "hidden";

  return (
    <>
      <Appbar>
        <Appbar.BackAction onPress={onClickBack} />
        <Appbar.Content title={`Editing: ${editedChecklist.name}`} />
        <Tooltip title="A checklist without items and without a name can't be saved">
          <Appbar.Action
            icon="check"
            disabled={isSaveDisabled}
            onPress={() => {
              if (isSaveDisabled) return;

              props.handleSaveChecklist({
                ...editedChecklist,
                items: editedChecklist.items.filter((item) => item.name),
              });
              props.handleBack();
            }}
          ></Appbar.Action>
        </Tooltip>
      </Appbar>
      <ScrollView
        style={{
          backgroundColor: theme,
          marginVertical: 10,
          marginHorizontal: 5,
        }}
      >
        <Card.Title title="Name of the checklist"></Card.Title>
        <Card.Content>
          <TextInput
            mode="outlined"
            placeholder="Emojis are welcome 🗿"
            style={{ marginBottom: 10 }}
            value={editedChecklist.name}
            onChangeText={(t) =>
              setEditedChecklist((prev) => ({ ...prev, name: t }))
            }
          />
        </Card.Content>

        <Card.Title title="Checklist Items"></Card.Title>
        <ScrollView style={{ marginBottom: 70 }}>
          {!editedChecklist?.items?.length ? (
            <View style={{ flex: 1 }}>
              <IconButton
                icon="plus"
                onPress={getHandleAdd()}
                disabled={!getHandleAdd()}
                style={{ width: "100%" }}
              />
            </View>
          ) : (
            editedChecklist.items.map((item, ind) => (
              <Field
                key={item.id}
                isLastItem={ind === editedChecklist.items.length - 1}
                getHandleAdd={getHandleAdd}
                handleEdit={handleEdit}
                handleRemove={handleRemove}
                item={item}
              />
            ))
          )}
        </ScrollView>
        {/* </Card.Content> */}
      </ScrollView>
      {/* </Surface> */}
      <Modal
        open={isModalVisible}
        title="Are you sure?"
        content="You have unsaved changes. Are you sure you want to go back?"
        okProps={{
          label: "Very sure",
          onPress: () => {
            props.handleBack();
          },
        }}
        cancelProps={{
          label: "Oops, not done yet!",
          onPress: () => {
            setIsModalVisible(false);
          },
        }}
      />
      {isPlusFabVisible && (
        <FAB
          icon="plus"
          onPress={getHandleAdd()}
          disabled={!getHandleAdd()}
          style={{
            position: "absolute",
            margin: 10,
            right: 0,
            bottom: 0,
          }}
        />
      )}
    </>
  );
};

export default EditChecklist;

type FieldProps = {
  item: Checklist["items"][number];
  handleEdit: (itemId: string, value: string) => void;
  handleRemove: (itemId: string) => void;
  getHandleAdd: () => () => void;
  isLastItem?: boolean;
};
const Field = (props: FieldProps) => {
  const { item, handleEdit, handleRemove, getHandleAdd, isLastItem } = props;
  const ref = useRef(null);
  const newlyAdded = !item.name;

  useEffect(() => {
    if (!newlyAdded) return;
    if (ref.current?.isFocused()) return;

    ref.current?.focus();
  }, [newlyAdded]);

  const onSubmit = () => {
    if (isLastItem) {
      if (getHandleAdd()) {
        getHandleAdd()();
        return;
      }
    }
    Keyboard.dismiss();
  };

  return (
    <View key={item.id} style={{ flexDirection: "row" }}>
      <TextInput
        onFocus={() => {}}
        ref={ref}
        outlineColor="transparent"
        mode="outlined"
        id={item.id + "input"}
        onChangeText={(text) => handleEdit(item.id, text)}
        key={item.id}
        onSubmitEditing={onSubmit}
        returnKeyType="next"
        blurOnSubmit={false}
        label={item.name ? undefined : "Add entry..."}
        style={{ marginBottom: 5, flex: 1 }}
        value={item.name}
      />
      <IconButton icon="close" onPress={() => handleRemove(item.id)} />
    </View>
  );
};
