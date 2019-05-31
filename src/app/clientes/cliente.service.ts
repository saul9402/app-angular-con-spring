import { Injectable } from '@angular/core';
import {CLIENTES} from './clientes.json';
import {Cliente} from './cliente';
/*import {Observable} from 'rxjs/Observable' esto es para angular 5*/
/*import { of } from 'rxjs/observable/of' esto es para la version 5*/

/* Esto es para angular 6*/
/*El Observable sirve para realizar las peticiones asincronas y poder usar Reactive*/
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';

  constructor(private http:HttpClient) { }

  getClientes():Observable<Cliente[]>{
    /*Con of() se convierte el listado de
     clientes en un flujo observable apartir
     de la lista de clientes*/
    //return of(CLIENTES);

    /*Esto se hace para realizar un cast ya que por
     defecto el metodo .get devuelve un objeto de
      tipo any y necesitamos un arreglo de clientes*/
      return this.http.get<Cliente[]>(this.urlEndPoint);

    /*
    esto es una segunda forma, funciona igual solo que con otra sintaxis
    */
  /*  return this.http.get(this.urlEndPoint).pipe(
      map(response => response as Cliente[])
    );*/
  }
}
