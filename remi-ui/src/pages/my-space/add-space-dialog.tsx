import { useAddSpaceMutate } from "@/api/spaces/spaces";
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
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export function AddSpaceDialogBtn() {
    const [spaceName, setSpaceName] = useState("");
    const navigate = useNavigate();

    const { mutateAsync: addSpaceReq, isPending } = useAddSpaceMutate();

    const addSpace = async () => {
        console.log(`Adding Space '${spaceName}'`);
        const newSpace = await addSpaceReq(spaceName);
        toast.success("Space added!", {
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
        navigate(`/spaces/${newSpace.space_id}`);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="whitespace-nowrap">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Space
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Space</DialogTitle>
                    <DialogDescription>
                        Enter name of your space. Click submit when you're done.
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
                            onChange={(e) =>
                                setSpaceName(e.target.value.trim())
                            }
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={addSpace}>
                        {isPending ? (
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
