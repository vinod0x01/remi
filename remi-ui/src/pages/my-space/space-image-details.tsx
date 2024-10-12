import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAddBoxesMutate, useSpacesQuery } from "@/api/spaces/spaces";
import { CircleArrowRight, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useMemo, useState } from "react";
import { AddBox, AddBoxesReq } from "@/api/spaces/types";
import ImageWithBoundingBox from "./image-bounding-box";
import { toast } from "react-toastify";
import { BoxInputType } from "./types";

export default function SpaceImageDetails() {
    const [editable, setEditable] = useState(false);
    const [boxes, setBoxes] = useState<BoxInputType[]>([]);
    const { spaceId, imageId } = useParams();
    const navigate = useNavigate();

    const { mutateAsync: addBoxesReq, isPending } = useAddBoxesMutate();

    const { data, isFetching } = useSpacesQuery();
    const [, imageDetail] = useMemo(() => {
        const space = data?.find((s) => s.space_id === spaceId);
        const imageDetail = space?.space_images?.find(
            (i) => i.id.toString() === imageId
        );
        return [space, imageDetail];
    }, [data, imageId, spaceId]);

    // box name ae editable only first time. once the finalized_boxes is created
    // box name will no longer be editable
    useEffect(() => {
        if (imageDetail?.finalized_boxes) {
            setBoxes(
                imageDetail.finalized_boxes.map((f) => ({
                    id: f.box_id,
                    box_name: f.box_name,
                    coordinates: f.coordinates,
                }))
            );
            return;
        }
        if (imageDetail?.initial_boxes_coordinates) {
            setBoxes(
                imageDetail.initial_boxes_coordinates.map((c, i) => ({
                    id: i + 1,
                    box_name: "",
                    coordinates: c,
                }))
            );
            setEditable(true);
        }
    }, [imageDetail?.finalized_boxes, imageDetail?.initial_boxes_coordinates]);

    if (isFetching) {
        return (
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-gray-500" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px] bg-gray-500" />
                    <Skeleton className="h-4 w-[200px] bg-gray-500" />
                </div>
            </div>
        );
    }

    if (!imageDetail) {
        return (
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    No Image in space {spaceId} with image id {imageId} found
                </h3>
                <p className="text-sm text-muted-foreground">
                    You can see all spaces
                    <Link to="/spaces" className="mt-4 block">
                        <Button>
                            Spaces <CircleArrowRight />
                        </Button>
                    </Link>
                </p>
            </div>
        );
    }

    const enterBoxName = (id: number, value: string) => {
        setBoxes(
            boxes.map((b) => {
                const box = { ...b };
                if (box.id === id) box.box_name = value.trim();

                return box;
            })
        );
    };

    const handleAddBoxed = async () => {
        if (!spaceId || !imageDetail) return;

        const boxesToAdd: AddBoxesReq = [];

        boxes.forEach((b) => {
            if (b.box_name === "") return;

            const boxToAdd: AddBox = {
                space_id: spaceId,
                image_id: imageDetail.id,
                box_id: b.id,
                box_name: b.box_name,
                coordinates: b.coordinates,
            };
            boxesToAdd.push(boxToAdd);
        });
        await addBoxesReq(boxesToAdd);

        toast.success("Boxes Added!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            // transition: ToastTransition.,
        });

        navigate(`/spaces/${spaceId}`);
    };

    return (
        <div className="flex gap-4 p-4 bg-gray-100 rounded-lg w-full">
            <Card className="flex-1 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                    {/* <img
                        src={`data:image/png;base64, ${imageDetail.space_image}`}
                        alt="Placeholder image"
                        className="max-w-full max-h-full object-contain"
                    /> */}
                    {!boxes || boxes.length === 0 ? (
                        <img
                            src={`data:image/png;base64, ${imageDetail.space_image}`}
                            alt="Placeholder image"
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <ImageWithBoundingBox
                            imageSrc={`data:image/png;base64, ${imageDetail.space_image}`}
                            boxes={boxes}
                        />
                    )}
                </div>
            </Card>
            <div className="flex flex-col flex-1 space-y-4 justify-between">
                <Card>
                    <CardHeader>
                        <CardTitle>Boxes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID</TableHead>
                                    <TableHead>Name</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {boxes.map((b) => (
                                    <TableRow key={`box-cordinates-${b.id}`}>
                                        <TableCell>{b.id}</TableCell>
                                        <TableCell>
                                            <Input
                                                value={b.box_name}
                                                disabled={!editable}
                                                onChange={(e) =>
                                                    enterBoxName(
                                                        b.id,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                <div className="flex justify-end">
                    {/* <Button variant="destructive">Delete Button</Button> */}
                    <Button
                        disabled={!editable}
                        onClick={() => handleAddBoxed()}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            ""
                        )}
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
