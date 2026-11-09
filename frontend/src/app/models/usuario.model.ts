export type RolModel = 'USER' | 'ADMIN';

export interface UsuarioModel {
    id: number | null;
    username: string;
    password: string;
    role: RolModel | null;
    edad: number | null;
    fechaNacimiento: string | null;
}
