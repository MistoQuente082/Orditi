import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { ModalController } from '@ionic/angular';
import { MapaModalPage } from '../mapa-modal/mapa-modal.page';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-perfil-ambulante',
  templateUrl: './perfil-ambulante.page.html',
  styleUrls: ['./perfil-ambulante.page.scss'],
})
export class PerfilAmbulantePage implements OnInit {

  public imgPessoa;
  public ambulante;
  // Variaveis da pessoa
  public nome: string;
  public cpf: string;
  public escolaridade: string;
  public endereco: string;
  public fone: string;


  // Variaveis Do trabalho
  public produto: string;
  public pontoRef: string;
  public localAtiv: string = "Anaaaaaa";
  public regiao: string;

  // Ponto no MApa
  public static local: any = { Rua: "Ana", Cep: "Amelia" };
  static localJson: any;
  constructor(
    public db: AngularFirestore,
    public alertas: AlertasService,
    public modalController: ModalController
    ){ 
      this.ambulante= db.collection("ambulantes").doc();
  }
  ngOnInit() {
    

  }

}
