import React, { useEffect } from "react";
import { BackHandler, FlatList, View } from "react-native";
import {
  Appbar,
  FAB,
  IconButton,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import { Checklist } from "../types";
import EditChecklist from "./EditChecklist";
import Modal from "./Modal";

const ManageChecklists = (props: {
  checklists: Checklist[];
  handleClickManageChecklist: (id: string) => void;
  handleAddChecklist: () => void;
  handleSaveChecklist: (checklist: Checklist) => void;
  handleRemoveChecklist: (id: string) => void;
  handleBack: () => void;
}) => {
  const [checklistToRemove, setChecklistToRemove] = React.useState<
    Checklist["id"] | null
  >();

  const [editingChecklistId, setEditingChecklistId] = React.useState<
    Checklist["id"] | null
  >();

  useEffect(() => {
    const handleFake = () => {
      props.handleBack();
      return true;
    };

    BackHandler.addEventListener("hardwareBackPress", handleFake);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleFake);
    };
  }, [props.handleBack]);

  const bg = useTheme().colors.surface;

  if (editingChecklistId) {
    const checklist = props.checklists.find((c) => c.id === editingChecklistId);

    if (!checklist) return <Text>Checklist not found</Text>;

    return (
      <EditChecklist
        checklist={checklist}
        handleSaveChecklist={props.handleSaveChecklist}
        handleBack={() => setEditingChecklistId(null)}
        handleRemoveChecklist={props.handleRemoveChecklist}
      />
    );
  }
  return (
    <>
      <Appbar>
        <Appbar.BackAction onPress={props.handleBack} />
        <Appbar.Content title={"Manage checklists"} />
      </Appbar>
      <FlatList
        scrollEnabled
        style={{ backgroundColor: bg }}
        data={props.checklists}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View
            style={{ alignSelf: "center", alignItems: "center", marginTop: 50 }}
          >
            <Text style={{ textAlign: "center" }} variant="bodyLarge">
              Create a checklist by clicking the + button
            </Text>
          </View>
        }
        renderItem={({ item: checklist }) => (
          <View style={{ flexDirection: "row" }}>
            <List.Item
              style={{ flex: 1 }}
              title={checklist.name}
              key={checklist.id}
              onPress={() => setEditingChecklistId(checklist.id)}
            />
            <IconButton
              icon="delete"
              onPress={() => setChecklistToRemove(checklist.id)}
            />
          </View>
        )}
      />

      {/* <Button
        onPress={() => {
          AsyncStorage.clear();
        }}
        icon="close"
        style={{ margin: 10, marginBottom: 100 }}
        mode="contained-tonal"
      >
        <Text>[Dev]: Reset App entirely</Text>
      </Button> */}
      <Modal
        open={!!checklistToRemove}
        title="Are you sure?"
        content="This will permanently delete the checklist."
        cancelProps={{
          onPress: () => {
            setChecklistToRemove(undefined);
          },
          label: "Cancel",
        }}
        okProps={{
          label: "Confirm",
          onPress: () => {
            if (!checklistToRemove) return;
            props.handleRemoveChecklist(checklistToRemove);
            setChecklistToRemove(undefined);
          },
        }}
      ></Modal>
      <FAB
        icon="plus"
        onPress={props.handleAddChecklist}
        style={{
          position: "absolute",
          margin: 10,
          right: 0,
          bottom: 0,
        }}
      />
    </>
  );
};

export default ManageChecklists;
