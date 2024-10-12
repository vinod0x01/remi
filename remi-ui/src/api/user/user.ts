import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { remiApi } from "../instance";
import {
    UserLoginReq,
    LoggedInUser,
    UserRegisterReq,
    SearchUserRes,
} from "./types";

const USER_STORE_KEY = "CURRENT_USER";

export function useUserQuery() {
    return useQuery({
        queryKey: ["users", "current"],
        queryFn: () => {
            const data = sessionStorage.getItem(USER_STORE_KEY);
            if (!data) return null;
            console.log("assasd");
            return JSON.parse(data) as LoggedInUser;
        },
        retry: false,
        staleTime: Infinity,
    });
}

export function useLoginMutate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: loginReq,
        onSuccess(data) {
            sessionStorage.setItem(USER_STORE_KEY, JSON.stringify(data));
            client.invalidateQueries();
        },
    });
}

export function useLogout() {
    const client = useQueryClient();

    return () => {
        sessionStorage.removeItem(USER_STORE_KEY);
        client.invalidateQueries();
    };
    // return useMutation({
    //     mutationFn: () => sessionStorage.removeItem(USER_STORE_KEY),
    //     // onSuccess(data) {
    //     //     sessionStorage.setItem(USER_STORE_KEY, JSON.stringify(data));
    //     //     client.invalidateQueries();
    //     // },
    // });
}

export const loginReq = (loginData: UserLoginReq) =>
    remiApi
        .post<LoggedInUser>("/api/auth/signin", loginData)
        .then((d) => d.data);

export function useRegisterMutate() {
    return useMutation({
        mutationFn: (data: UserRegisterReq) =>
            remiApi.post("/api/auth/signup", data).then((d) => d.data),
    });
}

export function useSearchUserQuery(userName: string) {
    return useQuery({
        queryKey: ["users", "username", userName],
        queryFn: () =>
            userName === ""
                ? null
                : remiApi
                      .post<SearchUserRes>("/api/space/searchuser", null, {
                          params: {
                              user_name: userName,
                          },
                      })
                      .then((d) => d.data),
        retry: false,
    });
}
