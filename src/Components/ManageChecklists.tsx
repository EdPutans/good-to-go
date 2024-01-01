import React from "react";
import { List } from "react-native-paper";
import { Checklist } from "../types";

const ManageChecklists = (props: {
  checklists: Checklist[];
  handleClickManageChecklist: (id: string) => void;
}) => {
  return (
    <>
      <List.Section title="Manage Checklists">
        {props.checklists.map((checklist) => (
          <List.Item
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            title={checklist.name}
            key={checklist.id}
            onPress={() => props.handleClickManageChecklist(checklist.id)}
          />
        ))}
      </List.Section>
    </>
  );
};

export default ManageChecklists;
