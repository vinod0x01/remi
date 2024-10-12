import { useDelSpaceMutate } from "@/api/spaces/spaces";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export type AddSpaceDialogBtnProps = {
    spaceId: string;
    spaceName: string;
};

export function DeleteSpaceDialogBtn({
    spaceId,
    spaceName,
}: AddSpaceDialogBtnProps) {
    const navigate = useNavigate();

    const { mutateAsync: delSpaceReq, isPending } = useDelSpaceMutate();

    const deleteSpace = async () => {
        console.log(`Deleting Space '${spaceId}'`);
        await delSpaceReq(spaceId);

        toast.success("Space deleted!", {
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
        navigate(`/spaces`);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className="text-red-700 hover:text-red-700"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete Space</DialogTitle>
                    <DialogDescription>
                        Name of your space. Click submit when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={deleteSpace}
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
