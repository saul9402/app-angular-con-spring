import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
/*swal es el nombre de la variable con la que vamos a importar el sweetalert2*/
import swal  from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente:Cliente = new Cliente();
  private titulo: string = "Crear Cliente";

  constructor(private clienteService:ClienteService, private router:Router,
    private activatedRoute:ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id =params['id'];
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    })
  }

  public create(): void{
    console.log("Clicked!");
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      //es como un redirect en thymeleaf, :D
      response  => {
        this.router.navigate(['/clientes'])
        swal.fire('Cliente Creado!', `${response.mensaje}: ${response.cliente.nombre}`, 'success')
      }
    )
  }

  public update(): void{
    this.clienteService.update(this.cliente)
    .subscribe(
      response => {
        this.router.navigate(['/clientes'])
        swal.fire('Cliente Actualizado!', `${response.mensaje}: ${response.cliente.nombre}`, 'success');
      }
    )
  }

}
