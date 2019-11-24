import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppModule } from '../app.module';

import _ from "lodash";
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';
import { ModalController } from '@ionic/angular';
import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';

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
    public modalCtrl: ModalController) {
    this.db.collection("ambulantes").valueChanges().subscribe(snapshot => {
      this.ambulantesTotal = snapshot;
      this.ambulantes = this.ambulantesTotal
    });
    this.db.collection("zonas").valueChanges().subscribe(snapshot => {
      this.zonasTotal = snapshot;
      this.zonas = this.zonasTotal;
    });
  }

  Fiscal() {
    return AppModule.getUsuarioStatus();
    console.log(AppModule.getUsuarioStatus())
  }

  filtrarCPF(busca: any) {
    let val = busca.target.value;
    if (val && val.trim() != "") {
      this.ambulantes = _.values(this.ambulantesTotal);
      this.ambulantes = this.ambulantes.filter(pessoa => {
        return (pessoa.cpf.indexOf(val) === 0)
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
  }

  ngOnInit() {
  }

}
