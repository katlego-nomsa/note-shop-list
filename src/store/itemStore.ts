import { CreateItemInput, Item, UpdateItemInput } from "../models/item";

// Items live in this array, so they reset when the server restarts
const items: Item[] = [];
let nextId = 1;

export const itemStore = {
  getAll(): Item[] {
    return items;
  },

  getById(id: number): Item | undefined {
    return items.find((item) => item.id === id);
  },

  create(input: CreateItemInput): Item {
    const now = new Date().toISOString();
    const item: Item = { id: nextId++, ...input, createdAt: now, updatedAt: now };
    items.push(item);
    return item;
  },

  update(id: number, changes: UpdateItemInput): Item | undefined {
    const item = this.getById(id);
    if (!item) return undefined;
    Object.assign(item, changes, { updatedAt: new Date().toISOString() });
    return item;
  },
};