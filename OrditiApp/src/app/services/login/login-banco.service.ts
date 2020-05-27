import { Injectable } from '@angular/core';
import { SqlOrditiService } from '../banco/sql-orditi.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LoginBancoService {

  res_login: any;
  public res_usuario: any = false;


  constructor(
    public httpClient: HttpClient
  ) { }

  fazerLogin(url_banco, dados) {


    //this.res_login = this.receberDados(url_banco, dados);
    console.log(this.res_login);
    this.res_login = 123;
    if (this.res_login === 123) {
      this.res_usuario = true
      return true
    } else {
      if (this.res_login === 'erro') {
        return 'erro';
      }
      else {
        this.res_usuario = false;
        return false
      }
    }
  }

  // Recebe os dados
  receberDados(url, dados) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    console.log('dados', dados);
    var resp;
    this.httpClient.post(
      url,
      dados,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })
      .subscribe(data => {
        console.log('Não houve nenhum erro no Banco: ', data)
        resp = data;
        if (data == 0) {

          this.res_usuario = true
          return true
        } else {

          this.res_usuario = false;
          return false

        }


      }, error => {
        console.log('Erro ao tentar fazer login pelo Banco: ', error);
        this.res_login = 'erro';
        if (this.res_login === 'erro') {
          return 'erro';
        }

      });

    console.log('respostaaaaaa ', resp);
  }


}
