import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Service, signal } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { tap } from 'rxjs';
import { AuthResponseModel, LoginModel, TokenPayloadModel } from '../models/auth.model';
import { RolModel, UsuarioModel } from '../models/usuario.model';

@Service()
export class AuthService {

    private cliente: HttpClient = inject(HttpClient);
    private router: Router = inject(Router);
    private readonly URL_BASE: string = 'https://gpcueb.org/simonfarfan/auth/';
    private readonly CLAVE_TOKEN: string = 'token';
    private readonly CLAVE_ROL: string = 'rol';
    private readonly CLAVE_USUARIO: string = 'usuario';

    usuario = signal<string | null>(this.leer(this.CLAVE_USUARIO));
    rol = signal<RolModel | null>(this.leer(this.CLAVE_ROL) as RolModel | null);
    esAdmin = computed(() => this.rol() === 'ADMIN');

    login(credenciales: LoginModel) {
        return this.cliente.post<AuthResponseModel>(this.URL_BASE + 'login', credenciales).pipe(
            tap((respuesta) => this.guardarSesion(credenciales.username, respuesta))
        );
    }

    registrar(usuario: UsuarioModel) {
        return this.cliente.post(this.URL_BASE + 'register', usuario, { responseType: 'text' });
    }

    logout() {
        this.borrar(this.CLAVE_TOKEN);
        this.borrar(this.CLAVE_ROL);
        this.borrar(this.CLAVE_USUARIO);
        this.usuario.set(null);
        this.rol.set(null);
    }

    getToken(): string | null {
        return this.leer(this.CLAVE_TOKEN);
    }

    estaAutenticado(): boolean {
        const token = this.getToken();
        if (!token) {
            return false;
        }
        const payload = this.decodificarToken(token);
        if (!payload || payload.exp * 1000 <= Date.now()) {
            this.logout();
            return false;
        }
        return true;
    }

    getHeaders(): HttpHeaders {
        const token = this.getToken();
        return token ? new HttpHeaders({ Authorization: 'Bearer ' + token }) : new HttpHeaders();
    }

    verificarSesion(): boolean | UrlTree {
        return this.estaAutenticado() ? true : this.router.createUrlTree(['/login']);
    }

    verificarAdmin(): boolean | UrlTree {
        if (!this.estaAutenticado()) {
            return this.router.createUrlTree(['/login']);
        }
        return this.esAdmin() ? true : this.router.createUrlTree(['/']);
    }

    verificarInvitado(): boolean | UrlTree {
        return this.estaAutenticado() ? this.router.createUrlTree(['/']) : true;
    }

    private guardarSesion(username: string, respuesta: AuthResponseModel) {
        this.escribir(this.CLAVE_TOKEN, respuesta.token);
        this.escribir(this.CLAVE_ROL, respuesta.role);
        this.escribir(this.CLAVE_USUARIO, username);
        this.usuario.set(username);
        this.rol.set(respuesta.role);
    }

    private decodificarToken(token: string): TokenPayloadModel | null {
        try {
            const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(atob(base64)) as TokenPayloadModel;
        } catch {
            return null;
        }
    }

    private leer(clave: string): string | null {
        try {
            return localStorage.getItem(clave);
        } catch {
            return null;
        }
    }

    private escribir(clave: string, valor: string) {
        try {
            localStorage.setItem(clave, valor);
        } catch {
            return;
        }
    }

    private borrar(clave: string) {
        try {
            localStorage.removeItem(clave);
        } catch {
            return;
        }
    }

}
