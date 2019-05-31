import { Injectable } from '@angular/core';
import {CLIENTES} from './clientes.json';
import {Cliente} from './cliente';
/*import {Observable} from 'rxjs/Observable' esto es para angular 5*/
/*import { of } from 'rxjs/observable/of' esto es para la version 5*/

/* Esto es para angular 6*/
/*El Observable sirve para realizar las peticiones asincronas y poder usar Reactive*/
import { Observable, of } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }

  getClientes():Observable<Cliente[]>{
    /*Con of() se convierte el listado de clientes en un flujo observable apartir de la lista de clientes*/
    return of(CLIENTES);
  }
}
