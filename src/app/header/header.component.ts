import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  titulo: string = 'App Angular';

  constructor(private authService: AuthService, private router: Router) { }

  logout(): void {
    let username = this.authService.usuario.username;
    this.authService.logout();
    swal.fire("Logout", `Hola ${username} has cerrado sesión con éxito`, 'success');
    this.router.navigate(['/login']);
  }

}
