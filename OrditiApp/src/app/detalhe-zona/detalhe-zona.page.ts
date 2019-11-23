import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AlertasService } from '../services/alertas.service';

@Component({
  selector: 'app-detalhe-zona',
  templateUrl: './detalhe-zona.page.html',
  styleUrls: ['./detalhe-zona.page.scss'],
})
export class DetalheZonaPage implements OnInit {
  local: any;

  constructor(
    navParams: NavParams,
    public alertas: AlertasService,
    public modalCtrl: ModalController,
  ) {
    this.local = navParams.get('info');
  }
  
  ngOnInit() {
  }

  async fechar() {
    await this.modalCtrl.dismiss();
  }

}
