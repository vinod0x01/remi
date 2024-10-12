import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useDelItemMutate } from "@/api/items/items";
import { ItemDetail } from "./types";

export type DeleteItemDialogBtnProps = {
    itemDetails: ItemDetail;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function DeleteItemDialogBtn({
    itemDetails,
    open,
    onOpenChange,
}: DeleteItemDialogBtnProps) {
    const { mutateAsync: delItemReq, isPending } = useDelItemMutate();

    const deleteItem = async () => {
        console.log(
            `Deleting item '${itemDetails.item_id}' Space '${itemDetails.spaceId}'`
        );
        await delItemReq({
            spaceId: itemDetails.spaceId,
            itemId: itemDetails.item_id,
        });

        toast.success("Item deleted!", {
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
                        Are you sure you want to delete '{itemDetails.itemName}
                        '?
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete the item from your inventory.
                    </DialogDescription>
                </DialogHeader>
                {/* <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            value={spaceName}
                            disabled
                            className="col-span-3"
                        />
                    </div>
                </div> */}
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={deleteItem}
                        variant="destructive"
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            ""
                        )}
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
