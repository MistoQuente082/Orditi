import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { AlertasService } from '../services/alertas.service';
import { Observable } from 'rxjs';
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';
import { AppModule } from '../app.module';

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

  constructor(
    private navParams: NavParams,
    public alertas: AlertasService,
    private modalCtrl: ModalController,
  ) {
    this.count = 0;
    console.log(this.info);
    this.local = this.navParams.get('info');
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
