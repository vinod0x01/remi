import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    AddBoxesReq,
    AddMemberReq,
    Space,
    Spaces,
    UploadImageReq,
} from "./types";
import { remiApi } from "../instance";

export function useSpacesQuery() {
    return useQuery({
        queryKey: ["spaces"],
        queryFn: () =>
            remiApi.get<Spaces>("/api/space/getspaces").then((d) => d.data),
        staleTime: Infinity,
        refetchOnMount: true, // default is true, refetch on new component mount only if data is staled
        refetchOnWindowFocus: false,
    });
}

export function useAddSpaceMutate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (spaceName: string) =>
            remiApi
                .post<Space>("/api/space/addspace", null, {
                    params: { space_name: spaceName },
                })
                .then((d) => d.data),
        onSuccess() {
            client.invalidateQueries({ queryKey: ["spaces"], exact: true });
        },
    });
}

export function useDelSpaceMutate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (spaceId: string) =>
            remiApi
                .delete("/api/space/deletespace", {
                    params: { space_id: spaceId },
                })
                .then((d) => d.data),
        onSuccess() {
            client.invalidateQueries({ queryKey: ["spaces"], exact: true });
        },
    });
}

export function useUploadImageMutate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: ({ spaceId, files }: UploadImageReq) => {
            const formData = new FormData();
            formData.append("space_id", spaceId);
            for (const file of files) {
                formData.append("files", file);
            }

            return remiApi
                .post("/api/space/uploadimages", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((d) => d.data);
        },
        onSuccess() {
            client.invalidateQueries({ queryKey: ["spaces"], exact: true });
        },
    });
}

export function useAddMemberMutate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (member: AddMemberReq) =>
            remiApi
                .post<Space>("/api/space/addspacemember", member)
                .then((d) => d.data),
        onSuccess() {
            client.invalidateQueries({ queryKey: ["spaces"], exact: true });
        },
    });
}

export function useAddBoxesMutate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (boxes: AddBoxesReq) =>
            remiApi.post("/api/space/addbox", boxes).then((d) => d.data),
        onSuccess() {
            client.invalidateQueries({ queryKey: ["spaces"], exact: true });
        },
    });
}
