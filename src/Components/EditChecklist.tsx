import React from "react";
import { FlatList, View } from "react-native";
import {
  Appbar,
  FAB,
  IconButton,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
import { Checklist } from "../types";

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

  const renderField = (item: Checklist["items"][number]) => (
    <View key={item.id}>
      <TextInput
        id={item.id + "input"}
        onChangeText={(text) => handleEdit(item.id, text)}
        key={item.id}
        onKeyPress={(event) => {
          if (event.nativeEvent.key === "Enter") {
            getHandleAdd();
          }
        }}
        returnKeyType="next"
        blurOnSubmit={false}
        placeholder="Add entry..."
        onSubmitEditing={getHandleAdd}
        style={{ marginBottom: 5 }}
        value={item.name}
      />
      <IconButton
        icon="delete"
        onPress={() => handleRemove(item.id)}
        style={{ position: "absolute", right: 0, top: 0 }}
      />
    </View>
  );

  return (
    <>
      <Appbar>
        <Appbar.BackAction onPress={props.handleBack} />
        <Appbar.Content title={`Editing: ${editedChecklist.name}`} />
        <Appbar.Action icon="delete"></Appbar.Action>
      </Appbar>
      <Surface style={{ flex: 1 }}>
        <Text variant="bodyLarge">Checklist name</Text>

        <TextInput
          placeholder="Name of the checklist"
          style={{}}
          value={editedChecklist.name}
          onChangeText={(t) =>
            setEditedChecklist((prev) => ({ ...prev, name: t }))
          }
        />
        <Text variant="bodyLarge">Checklist items</Text>
        <FlatList
          scrollEnabled
          data={editedChecklist.items}
          ListEmptyComponent={
            <Text>Empty checklist. Add some items, I guess?</Text>
          }
          renderItem={(vListItem) => renderField(vListItem.item)}
          ListFooterComponent={
            <IconButton
              icon="plus"
              onPress={getHandleAdd()}
              disabled={!getHandleAdd()}
              style={{ width: "100%" }}
            />
          }
        ></FlatList>
        <FAB
          style={{
            position: "absolute",
            margin: 10,
            right: 0,
            bottom: 0,
          }}
          disabled={
            isAddDisabled ||
            !editedChecklist.name ||
            !editedChecklist.items.length
          }
          onPress={() => {
            props.handleSaveChecklist(editedChecklist);
          }}
          icon="check"
        />
      </Surface>
    </>
  );
};

export default EditChecklist;
