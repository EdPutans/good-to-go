import { Checklist } from "../types";

const gymbagItems = [
  "Towel",
  "Shoes",
  "Water bottle",
  "Shirt",
  "Shorts/Leggings",
  "Deodorant",
  "Entry card",
  "Headphones",
  "HR Belt",
];

const justMuskThings = [
  "Buy a ticket",
  "Pack your bags",
  "Fly",
  "Land",
  "Hug Elon",
  "Go home (optional)",
];

const preSleepRoutineYouCouldAutomateProbably = [
  "Brush teeth",
  "Take medicine",
  "Set alarm",
  "Turn off outside lights",
  "Pet the dog",
  "Lock the doors",
  "Put phone on charger",
  "Put smart watch on charger",
];

export const onboardingList: Checklist[] = [
  {
    name: "Flight to Mars",
    id: new Date().toISOString() + 1,
    items: justMuskThings.map((item, index) => ({
      id: new Date().toISOString() + index,
      name: item,
      checked: false,
    })),
  },
  {
    name: "Gym bag checklist",
    id: new Date().toISOString() + 2,
    items: gymbagItems.map((item, index) => ({
      id: new Date().toISOString() + index,
      name: item,
      checked: false,
    })),
  },
  {
    name: "Nightly routine I can't automate yet",
    id: new Date().toISOString() + 3,
    items: preSleepRoutineYouCouldAutomateProbably.map((item, index) => ({
      id: new Date().toISOString() + index,
      name: item,
      checked: false,
    })),
  },
];
