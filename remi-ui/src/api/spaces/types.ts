export type Space = {
    space_id: string;
    space_name: string;
    owner_id: string;
    space_images: SpaceImage[] | null;
    memberids: string[] | null;
};

export type SpaceImage = {
    id: number;
    space_image: string; // Base64 encoded string,
    initial_boxes_coordinates: SpaceBoxCoordinate[];
    finalized_boxes: SpaceBox[] | null;
};

export type Spaces = Space[];

export type SpaceBoxCoordinate = {
    x: number;
    y: number;
}[];

export type SpaceBox = {
    box_id: number;
    box_name: string;
    coordinates: SpaceBoxCoordinate;
};

export type UploadImageReq = {
    spaceId: string;
    files: FileList;
};

export type AddMemberReq = {
    space_id: string;
    user_id: string;
    user_name: string;
};

export type AddBoxesReq = AddBox[];

export type AddBox = {
    space_id: string;
    image_id: number;
    box_id: number;
    box_name: string;
    coordinates: SpaceBoxCoordinate;
};
