import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { ModalService } from './modal.service';
import { AuthService } from 'src/app/usuarios/auth.service';
import { FacturaService } from 'src/app/facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  private fotoSeleccionada: File;
  progreso: number = 0;

  constructor(private clienteService: ClienteService,
    public authService: AuthService,
    public modalService: ModalService,
    private facturaService: FacturaService) { }

  ngOnInit() {
    // this.activatedRoute.paramMap.subscribe(params => {
    //   let id: number = +params.get('id');
    //   if (id) {
    //     this.clienteService.getCliente(id).subscribe(cliente => {
    //       this.cliente = cliente;
    //     });
    //   }
    // });
  }

  seleccionarFoto(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
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
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progreso = Math.round((event.loaded / event.total) * 100)
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            this.modalService.notificarUpload.emit(this.cliente);
            swal.fire("La foto se ha subido completamente!", response.mensaje, 'success');
          }
        });
    }
    this.fotoSeleccionada = null;
  }

  cerrarModal() {
    this.modalService.cerraModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  delete(factura: Factura): void {
    swal.fire({
      title: '¿Estás seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!'
    }).then((result) => {
      if (result.value) {
        this.facturaService.delete(factura.id).subscribe(
          response => {
            /*Se elimina de la lista que se muestra al cliente eliminado*/
            this.cliente.facturas = this.cliente.facturas.filter(fac => fac !== factura)
            swal.fire(
              'Factura eliminada!',
              `Factura ${factura.descripcion} ha sido eliminada.`,
              'success'
            )
          }
        );
      }
    })
  }

}
