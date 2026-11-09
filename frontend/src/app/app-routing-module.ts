import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Logincomponent } from './component/logincomponent/logincomponent';
import { Registrocomponent } from './component/registrocomponent/registrocomponent';
import { Principalcomponent } from './component/principalcomponent/principalcomponent';
import { NuevoUsuariocomponent } from './component/nuevo-usuariocomponent/nuevo-usuariocomponent';
import { EditarUsuariocomponent } from './component/editar-usuariocomponent/editar-usuariocomponent';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  {
    path: '',
    component: Principalcomponent,
    canActivate: [() => inject(AuthService).verificarSesion()]
  },
  {
    path: 'login',
    component: Logincomponent,
    canActivate: [() => inject(AuthService).verificarInvitado()]
  },
  {
    path: 'registro',
    component: Registrocomponent,
    canActivate: [() => inject(AuthService).verificarInvitado()]
  },
  {
    path: 'nuevo-usuario',
    component: NuevoUsuariocomponent,
    canActivate: [() => inject(AuthService).verificarAdmin()]
  },
  {
    path: 'editar-usuario/:id',
    component: EditarUsuariocomponent,
    canActivate: [() => inject(AuthService).verificarAdmin()]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
