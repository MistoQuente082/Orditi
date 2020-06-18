import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppModule } from '../app.module';

import _ from "lodash";

import { ModalController } from '@ionic/angular';
import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { LoginBancoService } from '../services/login/login-banco.service';
//import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';

@Component({
  selector: 'app-busca',
  templateUrl: './busca.page.html',
  styleUrls: ['./busca.page.scss'],
})
export class BuscaPage implements OnInit {
  
  public zonas: any[];

  
  public zonasTotal: any[];

  public tipo: any = "zona";

  public cpf: any;
  public regiao: any;

  constructor(
    private loginBanco: LoginBancoService,
    private sqlOrditi: SqlOrditiService,
    public modalCtrl: ModalController) {
      
    this.sqlOrditi.receberDados('http://syphan.com.br/orditiServices/listarZonas.php').subscribe(data => {
          this.zonasTotal = data;
          this.zonas = this.zonasTotal;
        }, error => {
          console.log(error);
        });;
  }

  Fiscal() {
    return this.loginBanco.res_usuario;

  }

  

  filtrarNomeRegiao(busca: any) {
    let val = busca.target.value;
    console.log(val);
    if (val && val.trim() !== "") {
      this.zonas = _.values(this.zonasTotal);
      console.log(this.zonas);
      this.zonas = this.zonas.filter(zona => {
        return (zona.nome.toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    }
    else {
      this.zonas = this.zonasTotal;
    }
  }

  async mostraDetalhes(zona) {
    console.log('click')
    const modal = await this.modalCtrl.create({
      component: DetalheZonaPage,
      componentProps: {
        info: zona
      }
    });
    return await modal.present();
    //this.alertas.presentModal(DetalheZonaPage, this.zona);
  }

  ngOnInit() {
  }

}
