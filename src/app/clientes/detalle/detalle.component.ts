import { Component, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  cliente: Cliente;
  titulo: string = "Detalle del cliente";
  private fotoSeleccionada: File;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let id: number = +params.get('id');
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => {
          this.cliente = cliente;
        });
      }
    });
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire("Error Seleccionar Imagen", "El archivo debe ser de tipo imagen", "error");
      this.fotoSeleccionada = null;
    }
    console.log(this.fotoSeleccionada);
  }

  subirFoto() {
    if (!this.fotoSeleccionada) {
      swal.fire("Error Upload", "debes seleccionar una foto", "error");
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(cliente => {
          this.cliente = cliente;
          swal.fire("La foto se ha subido completamente!", `La foto se ha subido con exito: ${cliente.foto}`, 'success');
        });
    }
  }

}
