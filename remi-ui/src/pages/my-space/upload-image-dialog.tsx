"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { useUploadImageMutate } from "@/api/spaces/spaces";
import { toast } from "react-toastify";

export type UploadImageDialogProps = {
    spaceId: string;
    spaceName: string;
};

export default function UploadImageDialogBtn({
    spaceId,
    spaceName,
}: UploadImageDialogProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);

    const { mutateAsync: uploadImageAsync, isPending } = useUploadImageMutate();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiles(event.target.files);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(`Uploaded image for '${spaceId}'`);
        if (!files) return;

        await uploadImageAsync({ spaceId, files });

        toast.success("Space image uploaded!", {
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
        setDialogOpen(false);
    };

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Images</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
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
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="files" className="text-right">
                            Files
                        </Label>
                        <div className="col-span-3">
                            <Input
                                id="files"
                                type="file"
                                onChange={handleFileChange}
                                multiple
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="ml-auto">
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            ""
                        )}
                        Upload
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
