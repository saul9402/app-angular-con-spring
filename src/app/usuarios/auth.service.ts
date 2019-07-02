import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //se pone asi para poder usar getters
  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  /**
   * Esta es la sintaxis correcta para un getter de alguna propiedad del modelo
   */
  public get usuario(): Usuario {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token')
      return this._token;
    }
    return null;

  }

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
  guadarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', this._token);
  }
  guadarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    //asi guardas datos en el session storage
    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));
  }

  obtenerDatosToken(accessToken: string) {
    if (accessToken != null && accessToken != "") {
      return JSON.parse(atob(accessToken.split(".")[1]));
    } else {
      return null;
    }
  }

  isAuthenticated():boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length > 0){
      return true;
    }
    return false;
  }
}
