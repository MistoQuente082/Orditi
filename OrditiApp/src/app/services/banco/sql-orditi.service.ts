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
        console.log(data);
        
        if (data['retorno'] == 1) {          
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
    return this.httpClient.post<any[]>(
      url,
      token,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })
  }

  receberPerfil(id){
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    const token = 39158;
    console.log(id)
    let lista = {token: token, id: id};
    return this.httpClient.post<any[]>(
      'http://localhost/orditiServices/filtrarAmbulante.php',
      lista,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })
  }

  receberNotificacoes(id){
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let token = 39158;
    console.log(id)
    let lista = {token: token, id: id};
    return this.httpClient.post<any[]>(
      'http://localhost/orditiServices/listarNotificacoes.php',
      lista,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })

  }

  receberFuncionarios(id){
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let token = 39158;
    console.log(id)
    let lista = {token: token, id: id};
    return this.httpClient.post<any[]>(
      'http://localhost/orditiServices/listarFuncionarios.php',
      lista,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })

  }
}
