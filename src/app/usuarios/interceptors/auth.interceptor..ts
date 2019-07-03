import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import swal from 'sweetalert2';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {

  }

  //con este metodo interceptas todos los request que se hagan desde angular y realizas un proceso previo a enviar
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {



    return next.handle(req).pipe(
      catchError(e => {
        if (e.status == 401) {
          if (this.authService.isAuthenticated()) {
            this.authService.logout();
          }
          this.router.navigate(['/login']);
        }
        if (e.status == 403) {
          swal.fire("Acceso Denegado", `Hola ${this.authService.usuario.username} no tienes accesos a este recurso`, 'warning');
          this.router.navigate(['/clientes']);
        }
        return throwError(e);
      })
    );
  }
}