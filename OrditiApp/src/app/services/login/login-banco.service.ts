import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LoginBancoService {
  public res_usuario: boolean = false;
  dados_usuario;

  constructor(

    public storage: Storage
  ) { }


  inserir(key, dados) {
    // set a key/value
    this.storage.set(key, dados);
    this.res_usuario = true;
  }

  recuperar(key) {


    return this.storage.get(key)

  }

  remover(key) {
    // set a key/value
    this.storage.clear();
    this.dados_usuario = null;
    this.res_usuario = false;
  }

}
