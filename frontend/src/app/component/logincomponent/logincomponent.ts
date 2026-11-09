import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { extraerError } from '../../utils/error.util';

@Component({
  selector: 'app-logincomponent',
  standalone: false,
  styleUrl: './logincomponent.css',
  templateUrl: './logincomponent.html',
})
export class Logincomponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';

  error = signal('');
  cargando = signal(false);

  iniciarSesion() {
    if (this.username.trim() === '' || this.password === '') {
      this.error.set('Ingrese el usuario y la contraseña.');
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    this.authService.login({ username: this.username.trim(), password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error) => {
        this.cargando.set(false);
        this.error.set(extraerError(error));
      }
    });
  }

}
