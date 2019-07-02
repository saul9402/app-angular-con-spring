import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';

import  swal  from "sweetalert2";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = "Por favor Sign In!";
  usuario: Usuario;

  constructor() {
    this.usuario = new Usuario();
  }

  ngOnInit() {
  }

  login(): void {
    console.log(this.usuario);
    if(this.usuario.username == null || this.usuario.username == "" || this.usuario.password == null || this.usuario.password == ""){
      swal.fire("Error Login", "Username o password vacíos!", 'error');
      return;
    }
  }

}
