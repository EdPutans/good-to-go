import isEqual from "lodash/isEqual";
import React from "react";
import { FlatList, View } from "react-native";
import {
  Appbar,
  Card,
  FAB,
  IconButton,
  Surface,
  TextInput,
  useTheme,
} from "react-native-paper";
import { Checklist } from "../types";
import Modal from "./Modal";

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
    <View key={item.id} style={{ flexDirection: "row" }}>
      <TextInput
        outlineColor="transparent"
        mode="outlined"
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
        label={item.name ? undefined : "Add entry..."}
        onSubmitEditing={getHandleAdd}
        style={{ marginBottom: 5, flex: 1 }}
        value={item.name}
      />
      <IconButton icon="close" onPress={() => handleRemove(item.id)} />
    </View>
  );
  const theme = useTheme().colors.background;
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  const onClickBack = () => {
    if (isEqual(editedChecklist, props.checklist)) {
      props.handleBack();
      return;
    }

    setIsModalVisible(true);
  };

  return (
    <>
      <Appbar>
        <Appbar.BackAction onPress={onClickBack} />
        <Appbar.Content title={`Editing: ${editedChecklist.name}`} />

        <Appbar.Action
          icon="check"
          disabled={!editedChecklist.name || !editedChecklist.items.length}
          onPress={() => {
            props.handleSaveChecklist({
              ...editedChecklist,
              items: editedChecklist.items.filter((item) => item.name),
            });
            props.handleBack();
          }}
        ></Appbar.Action>
      </Appbar>
      <Surface style={{ flex: 1 }}>
        <Card
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
              placeholder="Name of the checklist"
              style={{ marginBottom: 10 }}
              value={editedChecklist.name}
              onChangeText={(t) =>
                setEditedChecklist((prev) => ({ ...prev, name: t }))
              }
            />
          </Card.Content>
          {/* </Card> */}
          {/* <Text variant="bodyLarge">Checklist items</Text> */}
          {/* <Card style={{ backgroundColor: theme }}> */}
          <Card.Title title="Checklist Items"></Card.Title>
          <Card.Content>
            <FlatList
              scrollEnabled
              data={editedChecklist.items}
              ListEmptyComponent={
                <View style={{ flex: 1 }}>
                  <IconButton
                    icon="plus"
                    onPress={getHandleAdd()}
                    disabled={!getHandleAdd()}
                    style={{ width: "100%" }}
                  />
                </View>
              }
              renderItem={(vListItem) => renderField(vListItem.item)}
            ></FlatList>
          </Card.Content>
        </Card>
        {editedChecklist.items.length > 0 && (
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
      </Surface>
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
    </>
  );
};

export default EditChecklist;
