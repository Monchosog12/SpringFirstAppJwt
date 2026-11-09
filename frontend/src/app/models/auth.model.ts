import { RolModel } from './usuario.model';

export interface LoginModel {
    username: string;
    password: string;
}

export interface AuthResponseModel {
    token: string;
    role: RolModel;
}

export interface TokenPayloadModel {
    sub: string;
    iat: number;
    exp: number;
}
