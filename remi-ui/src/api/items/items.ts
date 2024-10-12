import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { remiApi } from "../instance";
import { AddItemReq, DeleteItemReq, Item, UpdateItemReq } from "./types";

export function useItemsQuery(itemName: string) {
    return useQuery({
        queryKey: ["Items", "itemName", itemName],
        queryFn: () =>
            remiApi
                .get<Item[]>("/api/item/search", {
                    params: { item_name: itemName },
                })
                .then((d) => d.data),
    });
}

export function useDelItemMutate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: ({ spaceId, itemId }: DeleteItemReq) =>
            remiApi
                .post("/api/item/delete", null, {
                    params: {
                        item_id: itemId,
                        space_id: spaceId,
                    },
                })
                .then((d) => d.data),
        onSuccess() {
            client.invalidateQueries({ queryKey: ["Items", "itemName"] });
        },
    });
}

export function useAddItemMutate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (item: AddItemReq) =>
            remiApi.post("/api/item/add", item).then((d) => d.data),
        onSuccess() {
            client.invalidateQueries({ queryKey: ["Items", "itemName"] });
        },
    });
}

export function useUpdateItemMutate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: (item: UpdateItemReq) =>
            remiApi.post("/api/item/update", item).then((d) => d.data),
        onSuccess() {
            client.invalidateQueries({ queryKey: ["Items", "itemName"] });
        },
    });
}
