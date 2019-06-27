import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;

  constructor() { }


  abrirModal() {
    this.modal = true;
  }

  cerraModal() {
    this.modal = false;
  }
}
