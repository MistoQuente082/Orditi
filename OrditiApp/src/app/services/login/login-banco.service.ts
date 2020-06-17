import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class LoginBancoService {
  public res_usuario: any = false;
  dados_usuario;

  constructor(

    public storage: Storage
  ) { }


  inserir(key, dados) {
    // set a key/value
    this.storage.set(key, dados);
  }

  recuperar(key) {
    return this.storage.get(key)
    .then((dados) => {
      console.log('dadinhos', dados);
      this.dados_usuario = dados
      this.res_usuario = true
    });

  } 


}
