import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Navcomponent } from './component/navcomponent/navcomponent';
import { Logincomponent } from './component/logincomponent/logincomponent';
import { Registrocomponent } from './component/registrocomponent/registrocomponent';
import { Principalcomponent } from './component/principalcomponent/principalcomponent';
import { NuevoUsuariocomponent } from './component/nuevo-usuariocomponent/nuevo-usuariocomponent';
import { EditarUsuariocomponent } from './component/editar-usuariocomponent/editar-usuariocomponent';

@NgModule({
  declarations: [
    App,
    Navcomponent,
    Logincomponent,
    Registrocomponent,
    Principalcomponent,
    NuevoUsuariocomponent,
    EditarUsuariocomponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
