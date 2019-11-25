import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, ActionSheetController,NavParams } from '@ionic/angular';

@Component({
  selector: 'app-detalhe-eventos',
  templateUrl: './detalhe-eventos.page.html',
  styleUrls: ['./detalhe-eventos.page.scss'],
})
export class DetalheEventosPage implements OnInit {
  evento : any;
  constructor(
    public modalController: ModalController,
		navParams: NavParams,
		public db: AngularFirestore,
  ) { this.evento = navParams.get('evento'); }

  ngOnInit() {
  }

}
