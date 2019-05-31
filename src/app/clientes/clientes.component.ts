import { Component, OnInit } from '@angular/core';
import {Cliente} from './cliente';
import {ClienteService } from './cliente.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor(private clienteService: ClienteService) { }

  ngOnInit() {
    this.clienteService.getClientes().subscribe(
      /*Este seria el observador; una varibale clientes
       que se envia como parametro a  una funcion ánonima
       y el varlor de esa variable se asigna a la variable
        clientes de esta clase*/
      clientes => this.clientes = clientes
    );
  }

}
