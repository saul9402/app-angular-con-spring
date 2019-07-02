import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {

  }

  //con este metodo interceptas todos los request que se hagan desde angular y realizas un proceso previo a enviar
  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {

    let token = this.authService.token;
    if (token != null) {
      //se agrega el header de autorizacion en caso de que exista
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      console.log("CONSOLAAAAAAAAAAAAAAAAAAAAAAAAA"+ authReq);
      //te manda al siguiente interceptor en el stack de interceptores
      //se debe modificar para evniar el reques modificado con las cabeceras que o quiero
      return next.handle(authReq);
    }

    return next.handle(req);
  }
}