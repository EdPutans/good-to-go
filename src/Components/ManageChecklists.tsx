import React from "react";
import { List } from "react-native-paper";

const ManageChecklists = (props: Props) => {
  return (
    <>
      <List.Section title="Manage Checklists">
        {props.checklists.map((checklist) => (
          <List.Item
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            title={checklist.name}
            key={checklist.id}
            onPress={() =>
              props.navigation.navigate(`edit-checklist-${checklist.id}`, {
                checklist,
              })
            }
          />
        ))}
      </List.Section>
    </>
  );
};

export default ManageChecklists;
