import axios from "axios";

export const remiApi = axios.create({
    // baseURL: "https://05a97b37-7765-419e-b28b-10134c2f7a9f.mock.pstmn.io",
    baseURL: "",
    headers: {
        Accept: "*/*",
        "Content-Type": "application/json",
    },
});
