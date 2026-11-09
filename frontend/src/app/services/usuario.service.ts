import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { UsuarioModel } from '../models/usuario.model';
import { AuthService } from './auth.service';

@Service()
export class UsuarioService {

    private cliente: HttpClient = inject(HttpClient);
    private authService: AuthService = inject(AuthService);
    private readonly URL_BASE: string = 'https://gpcueb.org/simonfarfan/user/';

    getUsuarios() {
        return this.cliente.get<UsuarioModel[]>(this.URL_BASE + 'getall', { headers: this.authService.getHeaders(), observe: 'response' });
    }

    contarUsuarios() {
        return this.cliente.get<number>(this.URL_BASE + 'count', { headers: this.authService.getHeaders(), observe: 'response' });
    }

    getPorId(id: number) {
        return this.cliente.get<UsuarioModel>(this.URL_BASE + 'getbyid/' + id, { headers: this.authService.getHeaders() });
    }

    postUsuario(usuario: UsuarioModel) {
        return this.cliente.post(this.URL_BASE + 'createjson', usuario, { headers: this.authService.getHeaders(), responseType: 'text' });
    }

    actualizarUsuario(id: number, usuario: UsuarioModel) {
        return this.cliente.put(this.URL_BASE + 'updatejson', usuario, { headers: this.authService.getHeaders(), params: { id }, observe: 'response', responseType: 'text' });
    }

    deletePorId(id: number) {
        return this.cliente.delete(this.URL_BASE + 'deletebyid/' + id, { headers: this.authService.getHeaders(), responseType: 'text' });
    }

    deletePorNombre(name: string) {
        return this.cliente.delete(this.URL_BASE + 'deletebyname', { headers: this.authService.getHeaders(), params: { name }, responseType: 'text' });
    }

    deletePorEdad(edad: number) {
        return this.cliente.delete(this.URL_BASE + 'deletebyedad', { headers: this.authService.getHeaders(), params: { edad }, responseType: 'text' });
    }

}
