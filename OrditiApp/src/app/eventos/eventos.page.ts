import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DetalheEventosPage } from '../detalhe-eventos/detalhe-eventos.page';

@Component({
  selector:'app-eventos',
  templateUrl:'./eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})

export class EventosPage implements OnInit {

  public eventos: Observable<any[]>;
  public modalController: ModalController;
  public router: Router;

  constructor(public db: AngularFirestore, ) {
    this.eventos = this.db.collection('eventos', ref => ref.orderBy('dataInicio', 'asc')).valueChanges();
  }

  ngOnInit() {
  }

  verEvento(){
    var evento = EventosPage;
    this.modalController.create(
      {
        component: DetalheEventosPage,
        componentProps: {
          evento: "eventos"
        }
      }).then((modalElement) => {
        modalElement.present();
      });
      this.router.navigate["/detalhe-eventos"]
  }

}
