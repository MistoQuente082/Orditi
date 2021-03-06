import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertasService } from '../alertas.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SqlOrditiService {


  public url_receber: string;
  public estado;
  ok: boolean;

  constructor(
    public httpClient: HttpClient,
    public router: Router,
    public alertas: AlertasService) {
  }


  // Envia dados 
  async enviarDados(dados, url_enviar, alerta, root ) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');
    let postData = dados;

    this.httpClient.post(
      url_enviar,
      postData,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })
      .subscribe(data => {
        console.log( data);
        if (data['retorno'] == 1) {          
          this.alertas.presentToast('Executado com sucesso!')
          this.ok = true;
          this.returnHome(root);
        } 
        else if (data['retorno'] == 2){
          this.alertas.presentToast('Já existe um cadastro nesse CPF');
        }
        else if (data['retorno'] == 3){
          this.alertas.presentToast('Já existe um cadastro nesse CNPJ');
        }
        else if (data['retorno'] == 4){
          this.alertas.presentToast('Você não possui cadastro mercantil. Vá à SEMEC e cadastre-se');
        }
        else {
          this.alertas.presentToast(alerta)
        }
      }, error => {
        console.log(error);
        this.alertas.presentToast('Não foi possível realizar o cadastro!')
      });

  }

  returnHome( root ) {
    if(root !== undefined){
      this.router.navigate([root]);
    }
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
      'https://www.maceio.orditi.com/services/filtrarAmbulante.php',
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
      'https://www.maceio.orditi.com/services/listarNotificacoes.php',
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
      'https://www.maceio.orditi.com/services/listarFuncionarios.php',
      lista,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })

  }
}
