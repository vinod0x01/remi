import { useAddMemberMutate } from "@/api/spaces/spaces";
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
import { Loader2, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSearchUserQuery } from "@/api/user/user";

export type AddMemberDialogBtnPorps = {
    spaceId: string;
};

export function AddMemberDialogBtn({ spaceId }: AddMemberDialogBtnPorps) {
    const [open, setOpen] = useState(false);
    const [typedUserName, setTypedUserName] = useState("");
    const [usernameToSearch, setUsernameToSearch] = useState("");

    const { data: searchUser } = useSearchUserQuery(usernameToSearch);

    const { mutateAsync: addMemberReq, isPending } = useAddMemberMutate();

    //debouncing of username
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setUsernameToSearch(typedUserName);
        }, 2000);

        return () => clearTimeout(delayDebounceFn);
    }, [typedUserName]);

    const addMember = async () => {
        if (!searchUser) return;
        console.log(`Adding Member '${typedUserName}'`);

        await addMemberReq({
            space_id: spaceId,
            user_id: searchUser.user_id,
            user_name: searchUser.user_name,
        });

        toast.success("Member added!", {
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
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="whitespace-nowrap" variant="outline">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Member
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Member</DialogTitle>
                    <DialogDescription>
                        Enter name of user. Click submit when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            User Name
                        </Label>
                        <Input
                            id="username"
                            type="text"
                            value={typedUserName}
                            onChange={(e) =>
                                setTypedUserName(e.target.value.trim())
                            }
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={addMember}
                        disabled={!searchUser}
                    >
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
