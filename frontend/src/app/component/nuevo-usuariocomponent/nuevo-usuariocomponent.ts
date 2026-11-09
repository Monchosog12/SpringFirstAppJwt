import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { RolModel } from '../../models/usuario.model';
import { extraerError } from '../../utils/error.util';

@Component({
  selector: 'app-nuevo-usuariocomponent',
  standalone: false,
  styleUrl: './nuevo-usuariocomponent.css',
  templateUrl: './nuevo-usuariocomponent.html',
})
export class NuevoUsuariocomponent {

  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  username = '';
  password = '';
  edad: number | null = null;
  fechaNacimiento = '';
  role: RolModel | null = null;

  error = signal('');
  guardando = signal(false);

  guardar() {
    if (this.username.trim() === '' || this.password === '' || this.edad === null || this.fechaNacimiento === '' || this.role === null) {
      this.error.set('Complete todos los campos.');
      return;
    }
    if (/[<>]/.test(this.username)) {
      this.error.set('El usuario no puede contener los caracteres < o >.');
      return;
    }
    this.guardando.set(true);
    this.usuarioService.postUsuario({
      id: null,
      username: this.username.trim(),
      password: this.password,
      role: this.role,
      edad: this.edad,
      fechaNacimiento: this.fechaNacimiento
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => {
        this.guardando.set(false);
        this.error.set(extraerError(error));
      }
    });
  }

}
