import { CreateItemInput, Item } from "../models/item";

// Items live in this array, so they reset when the server restarts
const items: Item[] = [];
let nextId = 1;

export const itemStore = {
  getAll(): Item[] {
    return items;
  },

  create(input: CreateItemInput): Item {
    const now = new Date().toISOString();
    const item: Item = { id: nextId++, ...input, createdAt: now, updatedAt: now };
    items.push(item);
    return item;
  },
};