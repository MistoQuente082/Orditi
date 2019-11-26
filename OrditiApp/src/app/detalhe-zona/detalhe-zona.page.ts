import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AlertasService } from '../services/alertas.service';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-detalhe-zona',
  templateUrl: './detalhe-zona.page.html',
  styleUrls: ['./detalhe-zona.page.scss'],
})
export class DetalheZonaPage implements OnInit {
  local: any;

  ambulantes: Observable<any[]>;

  constructor(
    public db: AngularFirestore,
    navParams: NavParams,
    public alertas: AlertasService,
    public modalCtrl: ModalController,
  ) {
    this.local = navParams.get('info');
    this.ambulantes = db.collection("ambulantes", ref =>
      ref.where('regiao', '==', this.local.nome)).valueChanges();
  }

  ngOnInit() {
  }

  async fechar() {
    await this.modalCtrl.dismiss();
  }

}
