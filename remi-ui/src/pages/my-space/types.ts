import { SpaceBoxCoordinate } from "@/api/spaces/types";

export type BoxInputType = {
    id: number;
    box_name: string;
    coordinates: SpaceBoxCoordinate;
};
