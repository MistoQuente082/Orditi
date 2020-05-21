import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertasService } from '../alertas.service';


@Injectable({
  providedIn: 'root'
})
export class SqlOrditiService {


  public url_receber: string;
  public estado;

  constructor(
    public httpClient: HttpClient,
    public alertas: AlertasService) {
  }


  // Envia dados 
  async enviarDados(dados, url_enviar, alerta, ) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');


    let postData = dados;

    this.httpClient.post(
      url_enviar,
      postData,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })
      .subscribe(data => {
        if (data == 1) {
          this.alertas.presentToast('Executado com sucesso!')
        } else {
          this.alertas.presentToast(alerta)


        }

      }, error => {
        console.log(error);
        this.alertas.presentToast('Não foi possível realizar o cadastro!')


      });

  }

  // Recebe os dados
  receberDados(url) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');


    const token = 39158;

    this.httpClient.post(
      url,
      token,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })
      .subscribe(data => {
        console.log(data)



      }, error => {
        console.log(error);



      });
  }
}
