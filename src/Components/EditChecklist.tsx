import React from "react";
import { FlatList, View } from "react-native";
import { FAB, IconButton, Text, TextInput } from "react-native-paper";
import { Checklist } from "../types";

type Props = {
  checklist: Checklist;
  handleSaveChecklist: (checklist: Checklist) => void;
};

const EditChecklist = (props: Props) => {
  const [editedChecklist, setEditedChecklist] = React.useState<Checklist>(
    props.checklist
  );
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
      <FlatList
        ListHeaderComponentStyle={{ padding: 5 }}
        ListHeaderComponent={
          <TextInput
            placeholder="My checklist name"
            value={editedChecklist.name}
            onChangeText={(t) =>
              setEditedChecklist((prev) => ({ ...prev, name: t }))
            }
          />
        }
        scrollEnabled
        data={editedChecklist.items}
        ListEmptyComponent={<Text>Empty checklist. Add some items:</Text>}
        renderItem={(vListItem) => renderField(vListItem.item)}
        style={{ padding: 5 }}
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
          // props.navigation.navigate("settings");
        }}
        icon="check"
      />
    </>
  );
};

export default EditChecklist;
