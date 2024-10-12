export type UserLoginReq = {
    username: string;
    password: string;
};

export type LoggedInUser = {
    id: string;
    username: string;
    email: string;
    roles: string[];
};

export type UserRegisterReq = {
    email: string;
    password: string;
    username: string;
};

export type SearchUserRes = {
    user_id: string;
    user_name: string;
};
