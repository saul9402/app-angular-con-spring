import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'paginator-nav',
  templateUrl: './paginator.component.html'
})
export class PaginatorComponent implements OnInit, OnChanges {

  @Input() paginador: any;
  paginas: number[];

  desde: number;
  hasta: number;

  constructor() { }

  ngOnInit() {
  }
//se agrega este metodo para saber cuando se cabmia el valor de algo en este componente para poder realizar e calculo cada vez
  ngOnChanges() {
    this.desde = Math.min(Math.max(1, this.paginador.number - 4), this.paginador.totalPages - 5);
    this.hasta = Math.max(Math.min(this.paginador.totalPages, this.paginador.number + 4), 6);
    console.log(this.desde);
    console.log(this.hasta);
    if (this.paginador.totalPages > 5) {
      this.paginas = new Array((this.hasta - this.desde) + 1)
        .fill(0)
        .map((valor, indice) => indice + this.desde);
    } else {
      this.paginas = new Array(this.paginador.totalPages)
        .fill(0)
        .map((valor, indice) => indice + 1);
    }
  }

}
