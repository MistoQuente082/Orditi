import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ListaAmbulantesService {

  public res_lista: boolean = false;
  dados_lista;

  constructor(
    public storage: Storage,
  ) { }

  inserir(key, lista){
    //salva a lista
    this.storage.set(key, lista);
    this.res_lista = true;
  }

  recuperar(key) {
    return this.storage.get(key)
  }

  remover(key) {
    // Limpa o storage
    this.storage.clear();
    this.dados_lista = null;
    this.res_lista = false;
  }
}
