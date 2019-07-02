import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(usuario: Usuario): Observable<any> {
    const urlEndPoint: string = "http://localhost:8080/oauth/token";
    // se cifran en base 64 las credenciales de la aplicacion
    const credenciales = btoa('angularapp' + ':' + '12345');
    // se crean los headers donde se indica que se envian parametros codificados en la url
    // y que se usuará una autenticacion de tipo Basic para logearse
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    // y aqui van los parametros adicionales que indicaran la forma en la que el usuario se está logeando
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    // Todo eso va en una petición post con el orden aqui especificado
    console.log(params.toString());
    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }
}
