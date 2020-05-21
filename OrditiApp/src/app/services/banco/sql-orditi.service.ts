import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertasService } from '../alertas.service';


@Injectable({
  providedIn: 'root'
})
export class SqlOrditiService {

  public urlBanco: string;
  public estado;

  constructor(
    public httpClient: HttpClient,
    public alertas: AlertasService) {
  }


  async enviarDados(dados) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    let estado;
    let postData = dados;

    this.httpClient.post(
      this.urlBanco,
      postData,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })
      .subscribe(data => {
        if (data == 1) {
          this.alertas.presentToast('Executado com sucesso!')
        } else {
          this.alertas.presentToast('Não foi possível realizar o cadastro!')


        }

      }, error => {
        console.log(error);
        this.alertas.presentToast('Não foi possível realizar o cadastro!')


      });

  }

}
