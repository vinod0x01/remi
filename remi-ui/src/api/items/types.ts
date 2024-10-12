export type Item = {
    item_id: string;
    itemName: string;
    spaceId: string;
    boxId: number;
    imageId: number;
};

export type DeleteItemReq = {
    spaceId: string;
    itemId: string;
};

export type AddItemReq = {
    item_name: string;
    space_id: string;
    box_id: number;
    image_id: number;
};

export type UpdateItemReq = {
    item_id: string;
    itemName: string;
    spaceId: string;
    boxId: number;
    imageId: number;
};
