import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppModule } from '../app.module';

import _ from "lodash";
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';
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
  public ambulantes: any[];
  public zonas: any[];

  public ambulantesTotal: any[];
  public zonasTotal: any[];

  public tipo: any = "zona";

  public cpf: any;
  public regiao: any;

  constructor(public db: AngularFirestore,
    private loginBanco: LoginBancoService,
    private sqlOrditi: SqlOrditiService,
    public modalCtrl: ModalController) {
      this.sqlOrditi.receberDados('http://syphan.com.br/orditiServices/listarAmbulantes.php').subscribe(data => {
          this.ambulantesTotal = data;
          this.ambulantes = this.ambulantesTotal;
        }, error => {
          console.log(error);
        });;
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

  filtrarCPF(busca: any) {
    let val = busca.target.value;
    if (val && val.trim() != "") {
      this.ambulantes = _.values(this.ambulantesTotal);
      this.ambulantes = this.ambulantes.filter(pessoa => {
        return (pessoa.identidade.indexOf(val) === 0)
      })
    }
    else {
      this.ambulantes = this.ambulantesTotal;
    }
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

  async verMais(item) {
    const modal = await this.modalCtrl.create({
      component: PerfilAmbulantePage,
      componentProps: {
        info: item
      }
    });
    return await modal.present();
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
