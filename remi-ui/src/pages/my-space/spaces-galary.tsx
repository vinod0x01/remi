"use client";

// import { Input } from "@/components/ui/input";
import { useSpacesQuery } from "@/api/spaces/spaces";
import { Link } from "react-router-dom";
import { AddSpaceDialogBtn } from "./add-space-dialog";
import { Skeleton } from "@/components/ui/skeleton";

const DEFAULT_IMAGE =
    "https://plus.unsplash.com/premium_photo-1676823553207-758c7a66e9bb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function SpacesGlairy() {
    const { data, isLoading } = useSpacesQuery();

    if (isLoading) {
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

    if (!data || data.length == 0) {
        return (
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    You have no Spaces
                </h3>
                <p className="text-sm text-muted-foreground">
                    You can start adding new Space
                </p>
                <AddSpaceDialogBtn />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full w-full p-6 space-y-6">
            <div className="flex justify-end items-center space-x-4">
                {/* <Input
                    className="flex-grow"
                    type="text"
                    placeholder="Search..."
                /> */}
                <AddSpaceDialogBtn />
            </div>
            <div className="overflow-auto flex-grow">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto flex-grow auto-rows-min">
                    {data.map((space) => (
                        <Link
                            key={space.space_id}
                            to={`/spaces/${space.space_id}`}
                            className="block relative overflow-hidden rounded-lg shadow-lg aspect-video group "
                        >
                            <img
                                src={
                                    space.space_images?.[0]?.space_image
                                        ? `data:image/png;base64, ${space.space_images[0].space_image}`
                                        : DEFAULT_IMAGE
                                }
                                alt={space.space_name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-10000 ease-in-out transform scale-110 animate-zoom"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                                <h3 className="text-white text-xl font-semibold">
                                    {space.space_name}
                                </h3>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
