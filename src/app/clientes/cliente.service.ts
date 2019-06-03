import { Injectable } from '@angular/core';
import {CLIENTES} from './clientes.json';
import {Cliente} from './cliente';
/*import {Observable} from 'rxjs/Observable' esto es para angular 5*/
/*import { of } from 'rxjs/observable/of' esto es para la version 5*/

/* Esto es para angular 6*/
/*El Observable sirve para realizar las peticiones asincronas y poder usar Reactive*/
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': "application/json"})

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

  create(cliente: Cliente) : Observable<Cliente>{
    /*
    se envia una peticion post para crear a cliente,
     como parametros van la URL, el objeto que contiene los declarations
     y los headers que acepta el endpoint. Finalmente como se están utilizando observables
     (programación reactiva se pone el tipo de objeto que va a devolver ese endpoint)
    */
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders});
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
  }

  update(cliente:Cliente):Observable<Cliente>{
    /*
    Los parametros son: url, los datos a modificar, en este caso el objeto cliente y finalmente los headers
    */

    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders})
  }

  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders})
  }
}