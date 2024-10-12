import { useSpacesQuery } from "@/api/spaces/spaces";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleArrowRight } from "lucide-react";
import { MouseEventHandler } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DeleteSpaceDialogBtn } from "./delete-space-dialog";
import UploadImageDialogBtn from "./upload-image-dialog";
import { AddMemberDialogBtn } from "./add-member-dialog";
import { useUserQuery } from "@/api/user/user";

interface ImageCardProps {
    imageSrc: string;
    boxNames: string[];
    onClick: MouseEventHandler<HTMLDivElement>;
}

const ImageCard = ({ imageSrc, boxNames, onClick }: ImageCardProps) => (
    <Card
        onClick={onClick}
        className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
    >
        <CardContent className="p-0">
            <img
                src={imageSrc}
                alt="Card image"
                className="w-full h-48 object-cover"
            />
        </CardContent>
        <CardFooter className="flex flex-col items-start p-4">
            {!boxNames || boxNames.length == 0 ? (
                <p className="text-sm text-gray-600">No box finalized</p>
            ) : (
                boxNames.map((name, index) => (
                    <p key={index} className="text-sm">
                        - {name}
                    </p>
                ))
            )}
        </CardFooter>
    </Card>
);

export default function SpaceDetails() {
    const { spaceId } = useParams();
    const navigate = useNavigate();

    const { data, isFetching } = useSpacesQuery();
    const { data: user } = useUserQuery();

    const space = data?.find((s) => s.space_id === spaceId);

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

    if (!space) {
        return (
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    No space with id {spaceId} found
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

    return (
        <div className="container mx-auto p-4 h-full w-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">Space: {space.space_name}</h1>
                <div className="space-x-2">
                    {/* <Button variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                    </Button> */}
                    {!user ? (
                        ""
                    ) : user.username === space.owner_id ? (
                        <>
                            <AddMemberDialogBtn spaceId={space.space_id} />
                            <UploadImageDialogBtn
                                spaceId={space.space_id}
                                spaceName={space.space_name}
                            />
                            <DeleteSpaceDialogBtn
                                spaceId={space.space_id}
                                spaceName={space.space_name}
                            />
                        </>
                    ) : (
                        ""
                    )}
                    {/* <AddMemberDialogBtn spaceId={space.space_id} />
                    <UploadImageDialogBtn
                        spaceId={space.space_id}
                        spaceName={space.space_name}
                    />
                    <DeleteSpaceDialogBtn
                        spaceId={space.space_id}
                        spaceName={space.space_name}
                    /> */}
                </div>
            </div>
            {!space.space_images ? (
                <p>No images added</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {space.space_images.map((i) => (
                        <ImageCard
                            key={`space-image-card-${i.id}`}
                            imageSrc={`data:image/png;base64, ${i.space_image}`}
                            boxNames={
                                i.finalized_boxes?.map((f) => f.box_name) ?? []
                            }
                            onClick={() =>
                                navigate(
                                    `/spaces/${space.space_id}/image/${i.id}`
                                )
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
