export type Section = "checklist" | "settings" | "single-edit";

export type Checklist = {
  name: string;
  id: string;
  items: {
    id: string;
    name: string;
    checked: boolean;
  }[];
};
