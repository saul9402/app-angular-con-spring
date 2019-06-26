import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs/operators';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor(private clienteService: ClienteService) { }

  ngOnInit() {
    this.clienteService.getClientes()
      .pipe(
        tap(clientes => {
          /*Este seria el observador; una varibale clientes
   que se envia como parametro a  una funcion ánonima
   y el varlor de esa variable se asigna a la variable
    clientes de esta clase*/
          clientes => this.clientes = clientes
          console.log("Clientes Component");
          clientes.forEach(cliente => {
            console.log(cliente.nombre);
          });
        })
      )
      .subscribe(/*este metodo (subscribe) es el más importante, si no se pone no se emiten los datos y por ende nada funciona*/);
  }

  delete(cliente: Cliente): void {
    swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.nombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            /*Se elimina de la lista que se muestra al cliente eliminado*/
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            swal.fire(
              'Eliminado!',
              `El cliente ${cliente.nombre} ha sido eliminado.`,
              'success'
            )
          }
        );

      }
    })

  }

}
