"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useSpacesQuery } from "@/api/spaces/spaces";
import { CircleArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function MemberGallery() {
    const { data: spaces, isLoading: isSpaceLoading } = useSpacesQuery();

    if (isSpaceLoading) {
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

    if (!spaces || spaces.length === 0) {
        return (
            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-2xl font-bold tracking-tight">
                    You have no member added for any of the spaces
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
        <div className="p-4 space-y-4 h-full w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Space</TableHead>
                        <TableHead>Member</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {spaces.map((s, idx) => (
                        <TableRow key={s.space_id}>
                            <TableCell className="font-medium">
                                {idx + 1}
                            </TableCell>
                            <TableCell>
                                <Link
                                    to={`/spaces/${s.space_id}`}
                                    className="text-indigo-600 decoration-indigo-500 underline font-semibold"
                                >
                                    {s.space_name}
                                </Link>
                            </TableCell>
                            <TableCell>{s.memberids?.join(",")}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
