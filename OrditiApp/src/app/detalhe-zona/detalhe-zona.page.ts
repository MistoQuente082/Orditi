import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { AlertasService } from '../services/alertas.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';
import { AppModule } from '../app.module';
import { ListaAmbulantesService } from '../services/lista-ambulantes/lista-ambulantes.service';

@Component({
  selector: 'app-detalhe-zona',
  templateUrl: './detalhe-zona.page.html',
  styleUrls: ['./detalhe-zona.page.scss'],
})
export class DetalheZonaPage implements OnInit {
  local: any;

  ambulantes: Observable<any[]>;

  info;

  count

  listaFiltro: any;

  

  constructor(
    public db: AngularFirestore,
    private navParams: NavParams,
    public alertas: AlertasService,
    private modalCtrl: ModalController,
    private listaAmbulante: ListaAmbulantesService,
  ) {
    this.count = 0;
    console.log(this.info);
    this.local = this.navParams.get('info');
    this.ambulantes = this.db.collection("ambulantes", ref =>
      ref.where('regiao', '==', this.local.nome)).valueChanges();
    this.ambulantes.forEach(doc => {
      this.count += 1
    })

    this.listaAmbulante.recuperar('lista').then((data)=>{
      data.forEach( e=> {
        if(e.regiao === this.local.nome){
          this.listaFiltro.push(e);
        }
      })
        }, error => {
          console.log(error);
        });;

  }

  ngOnInit() {

  }

  //Retorna o tipo do perfil
  fiscal() {
    return AppModule.getUsuarioStatus();
  
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

  async fechar() {
    await this.modalCtrl.dismiss();
  }

}
