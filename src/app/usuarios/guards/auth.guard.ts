import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.authService.isAuthenticated()) {
      if (this.isTokenExpirado) {
        this.authService.logout();
        swal.fire("Token Expirado", `Hola ${this.authService.usuario.username} tu sesión ha expirado. Inicia sesión de nuevo`, 'info');
        this.router.navigate(['/login']);
        return false;
      }
      return true;
    }
    swal.fire("Usuario Ánonimo", "Debes autenticarte para acceder a este recurso", 'warning');
    this.router.navigate(['/login']);
    return false;
  }

  isTokenExpirado(): boolean {
    let token = this.authService.token;
    let payload = this.authService.obtenerDatosToken(token);
    // Obtiene fecha actual en segundos
    let now = new Date().getTime() / 1000;
    if (payload.exp < now) {
      return true;
    }
    return false;
  }

}
