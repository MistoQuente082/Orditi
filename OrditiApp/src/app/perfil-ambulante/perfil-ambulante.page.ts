import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { NavParams, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil-ambulante',
  templateUrl: './perfil-ambulante.page.html',
  styleUrls: ['./perfil-ambulante.page.scss'],
})
export class PerfilAmbulantePage implements OnInit {

  ambulante: any;
  // Variaveis da pessoa
  constructor(
    public db: AngularFirestore,
    public alertas: AlertasService,
    public modalController: ModalController
    ){ 
      this.ambulante= NavParams.get("");
  }
  
  ngOnInit() {
    

  }

}
