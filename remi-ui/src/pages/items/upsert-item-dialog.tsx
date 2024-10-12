import { useAddItemMutate, useUpdateItemMutate } from "@/api/items/items";
import { Spaces } from "@/api/spaces/types";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ItemDetail } from "./types";

export type UpsertItemDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    spaces: Spaces;
    selectedItem?: ItemDetail | null;
};

export default function UpsertItemDialog({
    open,
    onOpenChange,
    spaces,
    selectedItem,
}: UpsertItemDialogProps) {
    const [itemName, setItemName] = useState("");
    const [selectSpace, setSelectSpace] = useState("");
    const [selectBox, setSelectBox] = useState("");

    const { mutateAsync: addItemReq, isPending: isAddPending } =
        useAddItemMutate();
    const { mutateAsync: updateItemReq, isPending: isUpdatePending } =
        useUpdateItemMutate();

    const renderSpaceSelectItem = useMemo(
        () =>
            spaces.map((s) => (
                <SelectItem key={s.space_id} value={s.space_id}>
                    {s.space_name}
                </SelectItem>
            )),
        [spaces]
    );

    const renderImagesSelect = useMemo(() => {
        if (selectSpace === "") return;

        const space = spaces.find((f) => f.space_id === selectSpace);
        if (!space) return;

        const selectArr: ReactNode[] = [];
        space.space_images?.forEach((s) => {
            s.finalized_boxes?.forEach((f) => {
                const id = `${f.box_id}|${s.id}`;
                selectArr.push(
                    <SelectItem key={id} value={id}>
                        {f.box_name} | {s.id}
                    </SelectItem>
                );
            });
        });

        return selectArr;
    }, [selectSpace, spaces]);

    useEffect(() => {
        if (!selectedItem) {
            setItemName("");
            setSelectSpace("");
            setSelectBox("");
            return;
        }

        setItemName(selectedItem?.itemName ?? "");
        setSelectSpace(selectedItem.spaceId);
        setSelectBox(`${selectedItem.boxId}|${selectedItem.imageId}`);
    }, [selectedItem]);

    const upsertItem = async () => {
        console.log(`Adding item`);
        const [boxId, imageId] = selectBox.split("|").map((i) => parseInt(i));
        if (!boxId || !imageId) return;

        let message = "No changes are made";

        if (!selectedItem) {
            message = "Item added!";
            await addItemReq({
                item_name: itemName,
                space_id: selectSpace,
                image_id: imageId,
                box_id: boxId,
            });
        } else {
            message = "Item updated!";
            await updateItemReq({
                item_id: selectedItem.item_id,
                itemName: itemName,
                spaceId: selectSpace,
                imageId: imageId,
                boxId: boxId,
            });
        }

        toast.success(message, {
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
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {selectedItem ? "Edit " : "Add "}
                        Item
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="item-name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="item-name"
                            className="col-span-3"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="space" className="text-right">
                            Space
                        </Label>
                        <Select
                            value={selectSpace}
                            onValueChange={(e) => setSelectSpace(e)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select space" />
                            </SelectTrigger>
                            <SelectContent>
                                {renderSpaceSelectItem}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="box" className="text-right">
                            Image
                        </Label>
                        <Select>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select image" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="box1">Box 1</SelectItem>
                                <SelectItem value="box2">Box 2</SelectItem>
                                <SelectItem value="box3">Box 3</SelectItem>
                            </SelectContent>
                        </Select>
                    </div> */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="box" className="text-right">
                            Box
                        </Label>
                        <Select
                            value={selectBox}
                            onValueChange={(v) => setSelectBox(v)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select box" />
                            </SelectTrigger>
                            <SelectContent>{renderImagesSelect}</SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={upsertItem}>
                        {isAddPending || isUpdatePending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            ""
                        )}
                        Submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
