import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common'

//import {CLIENTES} from './clientes.json';
import { Cliente } from './cliente';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
/*import {Observable} from 'rxjs/Observable' esto es para angular 5*/
/*import { of } from 'rxjs/observable/of' esto es para la version 5*/

/* Esto es para angular 6*/
/*El Observable sirve para realizar las peticiones asincronas y poder usar Reactive*/
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { Region } from './Region';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': "application/json" })

  constructor(private http: HttpClient, private router: Router) { }

  private isNoAutorizado(e): boolean {
    if (e.status == 401 || e.status == 403) {
      this.router.navigate(['/login'])
      return true;
    }
    return false;
  }

  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.urlEndPoint + "/regiones").pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }

  // getClientes(): Observable<Cliente[]> {
  //   /*Con of() se convierte el listado de
  //    clientes en un flujo observable apartir
  //    de la lista de clientes*/
  //   //return of(CLIENTES);

  //   /*Esto se hace para realizar un cast ya que por
  //    defecto el metodo .get devuelve un objeto de
  //     tipo any y necesitamos un arreglo de clientes*/
  //   // return this.http.get<Cliente[]>(this.urlEndPoint);

  //   /*
  //   esto es una segunda forma, funciona igual solo que con otra sintaxis
  //   */
  //   return this.http.get(this.urlEndPoint).pipe(
  //     //tap no cambia los datos sólo permite manipularlos
  //     tap(response => {
  //       let clientes = response as Cliente[];
  //       clientes.forEach(cliente => {
  //         console.log(cliente.nombre);
  //       });
  //     }),
  //     map(response => {
  //       let clientes = response as Cliente[];
  //       return clientes.map(cliente => {
  //         cliente.nombre = cliente.nombre.toUpperCase();
  //         let datePipe = new DatePipe('es');
  //         // cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
  //         //con 3 E se muestra el nombre del dia abreviado, con 4 Ese muestra completo
  //         //3 M es el nombre del mes abreviado, con 4 M es el nombre del mes completo
  //         //cliente.createAt = datePipe.transform(cliente.createAt, 'fullDate'); //revisar documentacion
  //         //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy'); //esto se deja como pipe en el html
  //         return cliente;
  //       }
  //       )
  //     }),
  //     //el orden en que ejecutes estas funciones es importante puesto 
  //     //que arriba debes convertir a clientes y aqui ya no porque el map ya lo hizo
  //     tap(clientes => {
  //       clientes.forEach(cliente => {
  //         console.log(cliente.nombre);
  //       });
  //     })
  //   );
  // }

  //metodo para paginacion
  getClientes(page: number): Observable<any> {
    return this.http.get(this.urlEndPoint + `/page/${page}`).pipe(
      tap((response: any) => {
        console.log("Nombres desde: Servicio 1");
        response.content.forEach(cliente => {
          console.log(cliente.nombre);
        });
      }),
      map((response: any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          let datePipe = new DatePipe('es');
          return cliente;
        })
        return response;
      }),
      tap(response => {
        console.log("Nombres desde: Servicio 2");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.nombre);
        });
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    /*
    se envia una peticion post para crear a cliente,
     como parametros van la URL, el objeto que contiene los declarations
     y los headers que acepta el endpoint. Finalmente como se están utilizando observables
     (programación reactiva se pone el tipo de objeto que va a devolver ese endpoint)
    */
    return this.http.post<any>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        if (e.status == 400) {
          return throwError(e);
        }

        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  createMap(cliente: Cliente): Observable<Cliente> {
    /*
  Una segunda forma de transformar lo que viene en el map si es requerido devolverun tipo especifico de dato
  como cliente
    */
    return this.http.post<Cliente>(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e => {
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      /*catchError permite analizar el flujo de informacion en
       busca de errores si se llega a dar alguno lo manda a la variable e
       y apartir de ahi se puede manejar. Con pipe puedes manejar "operadores"*/
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        this.router.navigate(['/clientes']);
        console.log(e.error.mensaje);
        swal.fire('Error al editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    )
  }

  update(cliente: Cliente): Observable<any> {
    /*
    Los parametros son: url, los datos a modificar, en este caso el objeto cliente y finalmente los headers
    */
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        if (e.status == 400) {
          return throwError(e);
        }
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        if (this.isNoAutorizado(e)) {
          return throwError(e);
        }
        console.log(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  subirFoto(archivo: File, id): Observable<HttpEvent<{}>> {
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );

    // Se comenta puesto que se agregala barra de progreso y se maneja de diferente forma
    // return this.http.post(`${this.urlEndPoint}/upload`, formData).pipe(
    //   map((response: any) => {
    //     return response.cliente as Cliente
    //   }),
    //   catchError(e => {
    //     console.log(e.error.mensaje);
    //     swal.fire(e.error.mensaje, e.error.error, 'error');
    //     return throwError(e);
    //   })
    // )
  }
}
