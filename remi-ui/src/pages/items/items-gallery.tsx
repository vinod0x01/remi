"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useItemsQuery } from "@/api/items/items";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpacesQuery } from "@/api/spaces/spaces";
import { Edit, Loader2, MoreHorizontal, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { DeleteItemDialogBtn } from "./delete-space-dialog";
import { ItemDetail } from "./types";
import UpsertItemDialog from "./upsert-item-dialog";
import { Link } from "react-router-dom";

export default function ItemsGallery() {
    const [typedTerm, setTypedTerm] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [openUpsertDialog, setOpenUpsertDialog] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<ItemDetail | null>(null);
    const [openDelDialog, setOpenDelDialog] = useState(false);
    const [itemToDel, setItemToDel] = useState<ItemDetail | null>(null);
    const { data: spaces, isLoading: isSpaceLoading } = useSpacesQuery();
    const {
        data: items,
        isLoading: isItemLoading,
        isFetching,
    } = useItemsQuery(searchTerm);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setSearchTerm(typedTerm);
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [typedTerm]);

    const mergeResponse = useMemo<ItemDetail[]>(() => {
        if (!spaces || spaces.length === 0 || !items || items.length === 0)
            return [];

        return items.map((item) => {
            const space = spaces.find((s) => s.space_id === item.spaceId);
            const spaceImage = space?.space_images?.find(
                (i) => i.id === item.imageId
            );
            const box = spaceImage?.finalized_boxes?.find(
                (b) => b.box_id === item.boxId
            );

            return {
                ...item,
                spaceName: space?.space_name ?? "",
                boxName: box?.box_name ?? "",
            };
        });
    }, [items, spaces]);

    if (isSpaceLoading || isItemLoading) {
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

    // if (!mergeResponse || mergeResponse.length === 0) {
    //     return (
    //         <div className="flex flex-col items-center gap-1 text-center">
    //             <h3 className="text-2xl font-bold tracking-tight">
    //                 You have no Items
    //             </h3>
    //             <p className="text-sm text-muted-foreground">
    //                 You can start adding new Item
    //             </p>
    //             <Button
    //                 className="mt-4"
    //                 onClick={() => {
    //                     setItemToEdit(null);
    //                     setOpenUpsertDialog(true);
    //                 }}
    //             >
    //                 Add Item
    //             </Button>
    //             {spaces ? (
    //                 <UpsertItemDialog
    //                     open={openUpsertDialog}
    //                     onOpenChange={setOpenUpsertDialog}
    //                     spaces={spaces}
    //                     selectedItem={itemToEdit}
    //                 />
    //             ) : (
    //                 ""
    //             )}
    //         </div>
    //     );
    // }

    return (
        <div className="p-4 space-y-4 h-full w-full">
            <div className="flex justify-between items-center">
                <div className="relative w-64">
                    <Input
                        className="pr-10"
                        type="search"
                        placeholder="Search..."
                        value={typedTerm}
                        onChange={(e) => setTypedTerm(e.target.value)}
                    />
                    {isFetching && (
                        <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-500" />
                    )}
                </div>
                <Button
                    onClick={() => {
                        setItemToEdit(null);
                        setOpenUpsertDialog(true);
                    }}
                >
                    Add Item
                </Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Space Name</TableHead>
                        <TableHead>Box Name</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mergeResponse.map((i, idx) => (
                        <TableRow key={i.item_id}>
                            <TableCell className="font-medium">
                                {idx + 1}
                            </TableCell>
                            <TableCell>{i.itemName}</TableCell>
                            <TableCell>
                                <Link
                                    to={`/spaces/${i.spaceId}`}
                                    className="text-indigo-600 decoration-indigo-500 underline font-semibold"
                                >
                                    {i.spaceName}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Link
                                    to={`/spaces/${i.spaceId}/image/${i.imageId}`}
                                    className="text-indigo-600 decoration-indigo-500 underline font-semibold"
                                >
                                    {i.boxName}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="h-8 w-8 p-0"
                                        >
                                            <span className="sr-only">
                                                Open menu
                                            </span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setItemToEdit(i);
                                                setOpenUpsertDialog(true);
                                            }}
                                        >
                                            <Edit className="mr-2 h-4 w-4 inline-block" />
                                            <span>Edit</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                setItemToDel(i);
                                                setOpenDelDialog(true);
                                            }}
                                        >
                                            <Trash className="mr-2 h-4 w-4 inline-block" />
                                            <span>Delete</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {itemToDel ? (
                <DeleteItemDialogBtn
                    itemDetails={itemToDel}
                    open={openDelDialog}
                    onOpenChange={setOpenDelDialog}
                />
            ) : (
                ""
            )}
            {spaces ? (
                <UpsertItemDialog
                    open={openUpsertDialog}
                    onOpenChange={setOpenUpsertDialog}
                    spaces={spaces}
                    selectedItem={itemToEdit}
                />
            ) : (
                ""
            )}
        </div>
    );
}
