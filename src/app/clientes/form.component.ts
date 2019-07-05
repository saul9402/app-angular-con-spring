import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
/*swal es el nombre de la variable con la que vamos a importar el sweetalert2*/
import swal from 'sweetalert2';
import { Region } from './Region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  regiones: Region[];
  public titulo: string = "Crear Cliente";
  public errores: string[];

  constructor(private clienteService: ClienteService, private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    });
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe((cliente) => this.cliente = cliente)
      }
    });
  }
  
  public create(): void {
    console.log(this.cliente);
    this.clienteService.create(this.cliente).subscribe(
      //es como un redirect en thymeleaf, :D
      response => {
        this.router.navigate(['/clientes'])
        swal.fire('Cliente Creado!', `${response.mensaje}: ${response.cliente.nombre}`, 'success')
      },
      err => {
        this.errores = err.error.errors as string[];
        console.error('Código de error desde el servidor: ' + err.status);
        console.error(err.error.errors);
      }
    )
  }

  public update(): void {
    console.log(this.cliente);
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente)
      .subscribe(
        response => {
          this.router.navigate(['/clientes'])
          swal.fire('Cliente Actualizado!', `${response.mensaje}: ${response.cliente.nombre}`, 'success');
        },
        err => {
          this.errores = err.error.errors as string[];
          console.error('Código de error desde el servidor: ' + err.status);
          console.error(err.error.errors);
        }
      )
  }

  //Con este metodo vas a comparar el valor region que trae el cliente con el que se está iterando en el *ngFor
  //el primer parametro es cada una de las regiones del ngFor y el segundo es el objeto que est asignado al cliente
  compararRegion(regionNgFor: Region, regionCliente: Region): boolean {
    if(regionNgFor === undefined && regionCliente === undefined){ 
      return true;
    }
    return regionNgFor == null || regionCliente == null ? false : regionNgFor.id === regionCliente.id;
  }

}
