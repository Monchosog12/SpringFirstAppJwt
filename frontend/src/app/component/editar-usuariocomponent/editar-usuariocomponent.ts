import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioModel } from '../../models/usuario.model';
import { extraerError } from '../../utils/error.util';

@Component({
  selector: 'app-editar-usuariocomponent',
  standalone: false,
  styleUrl: './editar-usuariocomponent.css',
  templateUrl: './editar-usuariocomponent.html',
})
export class EditarUsuariocomponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  id = Number(this.route.snapshot.paramMap.get('id'));
  usuario = signal<UsuarioModel | null>(null);
  nombreOriginal = signal('');
  error = signal('');
  guardando = signal(false);

  ngOnInit() {
    this.usuarioService.getPorId(this.id).subscribe({
      next: (usuario) => {
        this.nombreOriginal.set(usuario.username);
        this.usuario.set({ ...usuario, password: '' });
      },
      error: (error) => {
        this.error.set(error.status === 404 ? 'No se encontró el usuario con ID ' + this.id + '.' : extraerError(error));
      }
    });
  }

  guardar() {
    const usuario = this.usuario();
    if (!usuario) return;
    if (usuario.username.trim() === '' || usuario.password === '') {
      this.error.set('Complete el usuario y la nueva contraseña.');
      return;
    }
    this.guardando.set(true);
    this.usuarioService.actualizarUsuario(this.id, { ...usuario, username: usuario.username.trim() }).subscribe({
      next: (response) => {
        if (response.status === 202) {
          this.router.navigate(['/']);
          return;
        }
        this.guardando.set(false);
        this.error.set(response.body ?? 'No se pudo actualizar el usuario.');
      },
      error: (error) => {
        this.guardando.set(false);
        this.error.set(extraerError(error));
      }
    });
  }

}
