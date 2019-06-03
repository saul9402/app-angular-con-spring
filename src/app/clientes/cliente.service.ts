import { Injectable } from '@angular/core';
import {CLIENTES} from './clientes.json';
import {Cliente} from './cliente';
import swal  from 'sweetalert2';
import { Router } from '@angular/router';
/*import {Observable} from 'rxjs/Observable' esto es para angular 5*/
/*import { of } from 'rxjs/observable/of' esto es para la version 5*/

/* Esto es para angular 6*/
/*El Observable sirve para realizar las peticiones asincronas y poder usar Reactive*/
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint:string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': "application/json"})

  constructor(private http:HttpClient, private router: Router) { }

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

  create(cliente: Cliente) : Observable<any>{
    /*
    se envia una peticion post para crear a cliente,
     como parametros van la URL, el objeto que contiene los declarations
     y los headers que acepta el endpoint. Finalmente como se están utilizando observables
     (programación reactiva se pone el tipo de objeto que va a devolver ese endpoint)
    */
    return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  createMap(cliente: Cliente) : Observable<Cliente>{
    /*
  Una segunda forma de transformar lo que viene en el map si es requerido devolverun tipo especifico de dato
  como cliente
    */
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      /*catchError permite analizar el flujo de informacion en
       busca de errores si se llega a dar alguno lo manda a la variable e
       y apartir de ahi se puede manejar. Con pipe puedes manejar "operadores"*/
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  update(cliente:Cliente):Observable<any>{
    /*
    Los parametros son: url, los datos a modificar, en este caso el objeto cliente y finalmente los headers
    */
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id:number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }
}
