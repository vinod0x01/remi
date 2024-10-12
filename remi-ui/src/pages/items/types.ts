import { Item } from "@/api/items/types";

export type ItemDetail = Item & {
    spaceName: string;
    boxName: string;
};
