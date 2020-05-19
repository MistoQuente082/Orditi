import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class SqlOrditiService {

  private urlBanco: string = "http://www.syphan.com.br/orditi/teste.php";
  public estado;

  constructor(
    public httpClient: HttpClient) {
  }


  async enviarDados(dados) {
    let headers = new Headers();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');


    let postData = dados;

    this.httpClient.post(
      this.urlBanco,
      postData,
      { headers: new HttpHeaders({ "Content-Type": "application/json" }) })
      .subscribe(data => {
        console.log(data);
        return data;
      }, error => {
        console.log(error);
        return error;
      });
  }
}
