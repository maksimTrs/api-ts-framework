// Request and response shapes for Auth resource

export interface LoginResponse {
    token: string;
    info: LoginUserInfo;
}

export interface LoginUserInfo {
    _id: string;
    email: string;
    password: unknown;
    username: string;
    reset_token: string;
}
