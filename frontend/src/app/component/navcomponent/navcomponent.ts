import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navcomponent',
  standalone: false,
  styleUrl: './navcomponent.css',
  templateUrl: './navcomponent.html',
})
export class Navcomponent {

  protected authService = inject(AuthService);
  private router = inject(Router);

  cerrarSesion() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
