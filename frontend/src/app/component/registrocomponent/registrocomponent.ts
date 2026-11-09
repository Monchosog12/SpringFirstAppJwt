import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { extraerError } from '../../utils/error.util';

@Component({
  selector: 'app-registrocomponent',
  standalone: false,
  styleUrl: './registrocomponent.css',
  templateUrl: './registrocomponent.html',
})
export class Registrocomponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';
  confirmarPassword = '';
  edad: number | null = null;
  fechaNacimiento = '';

  error = signal('');
  mensaje = signal('');
  guardando = signal(false);

  registrar() {
    if (this.username.trim() === '' || this.password === '' || this.edad === null || this.fechaNacimiento === '') {
      this.error.set('Complete todos los campos.');
      return;
    }
    if (/[<>]/.test(this.username)) {
      this.error.set('El usuario no puede contener los caracteres < o >.');
      return;
    }
    if (this.password !== this.confirmarPassword) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    this.authService.registrar({
      id: null,
      username: this.username.trim(),
      password: this.password,
      role: 'USER',
      edad: this.edad,
      fechaNacimiento: this.fechaNacimiento
    }).subscribe({
      next: (respuesta) => {
        this.mensaje.set(respuesta + '. Ahora puede iniciar sesión.');
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (error) => {
        this.guardando.set(false);
        this.error.set(extraerError(error));
      }
    });
  }

}
