import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { UsuarioModel } from '../../models/usuario.model';
import { extraerError } from '../../utils/error.util';

@Component({
  selector: 'app-principalcomponent',
  standalone: false,
  styleUrl: './principalcomponent.css',
  templateUrl: './principalcomponent.html',
})
export class Principalcomponent implements OnInit {

  private usuarioService = inject(UsuarioService);
  protected authService = inject(AuthService);

  usuarios = signal<UsuarioModel[]>([]);
  total = signal<number | null>(null);
  mensaje = signal('');
  error = signal('');
  cargando = signal(false);

  tipoBusqueda = 'nombre';
  textoBusqueda = '';
  private filtro = signal({ tipo: 'nombre', texto: '' });

  tipoEliminar = 'id';
  valorEliminar = '';

  usuariosFiltrados = computed(() => {
    const { tipo, texto } = this.filtro();
    const valor = texto.trim().toLowerCase();
    if (valor === '') {
      return this.usuarios();
    }
    return this.usuarios().filter(u => {
      if (tipo === 'id') return String(u.id) === valor;
      if (tipo === 'edad') return String(u.edad) === valor;
      if (tipo === 'rol') return (u.role ?? '').toLowerCase() === valor;
      return u.username.toLowerCase().includes(valor);
    });
  });

  ngOnInit() {
    this.loadUsuarios();
  }

  loadUsuarios() {
    this.cargando.set(true);
    this.usuarioService.getUsuarios().subscribe({
      next: (response) => {
        this.usuarios.set(response.body ?? []);
        this.cargando.set(false);
      },
      error: (error) => {
        this.cargando.set(false);
        this.mostrarError(extraerError(error));
      }
    });
    this.usuarioService.contarUsuarios().subscribe({
      next: (response) => this.total.set(response.body ?? 0),
      error: () => this.total.set(null)
    });
  }

  buscar() {
    this.filtro.set({ tipo: this.tipoBusqueda, texto: this.textoBusqueda });
  }

  limpiarBusqueda() {
    this.textoBusqueda = '';
    this.buscar();
  }

  eliminar() {
    const valor = this.valorEliminar.trim();
    if (valor === '') {
      this.mostrarError('Ingrese el valor del campo a eliminar.');
      return;
    }
    if (this.tipoEliminar === 'id') {
      const id = Number(valor);
      if (!Number.isInteger(id)) {
        this.mostrarError('El ID debe ser un número entero.');
        return;
      }
      this.eliminarPorId(id);
      return;
    }
    if (this.tipoEliminar === 'edad') {
      const edad = Number(valor);
      if (!Number.isInteger(edad)) {
        this.mostrarError('La edad debe ser un número entero.');
        return;
      }
      if (!confirm('¿Eliminar todos los usuarios con edad ' + edad + '?')) return;
      this.usuarioService.deletePorEdad(edad).subscribe({
        next: (respuesta) => this.despuesDeEliminar(respuesta),
        error: (error) => this.mostrarError(extraerError(error))
      });
      return;
    }
    if (!confirm('¿Eliminar el usuario "' + valor + '"?')) return;
    this.usuarioService.deletePorNombre(valor).subscribe({
      next: (respuesta) => this.despuesDeEliminar(respuesta),
      error: (error) => this.mostrarError(extraerError(error))
    });
  }

  eliminarPorId(id: number) {
    if (!confirm('¿Eliminar el usuario con ID ' + id + '?')) return;
    this.usuarioService.deletePorId(id).subscribe({
      next: (respuesta) => this.despuesDeEliminar(respuesta),
      error: (error) => this.mostrarError(extraerError(error))
    });
  }

  private despuesDeEliminar(respuesta: string) {
    this.valorEliminar = '';
    this.error.set('');
    this.mensaje.set(respuesta);
    this.loadUsuarios();
  }

  private mostrarError(texto: string) {
    this.mensaje.set('');
    this.error.set(texto);
  }

}
