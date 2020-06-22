import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { NavParams, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

import { Router } from '@angular/router';

import { EditarAmbulantePage } from '../editar-ambulante/editar-ambulante.page';
import { NotificarAmbulantePage } from '../notificar-ambulante/notificar-ambulante.page';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';

@Component({
  selector: 'app-perfil-ambulante',
  templateUrl: './perfil-ambulante.page.html',
  styleUrls: ['./perfil-ambulante.page.scss'],
})
export class PerfilAmbulantePage implements OnInit {
  historico: boolean = false;
  trabalho: boolean = true;
  informacoes: boolean = false;

  historicoLista: any[]=[];
  ambulante: any;
  
  // Variaveis da pessoa
  constructor(
    public sqlOrditi: SqlOrditiService,
    public alertas: AlertasService,
    public navParam: NavParams,
    public modalController: ModalController,
    public router: Router,
  ) {
    this.ambulante = this.navParam.get('info');
    console.log(this.ambulante);
    this.sqlOrditi.receberNotificacoes(this.ambulante['id']).subscribe(data =>{
      console.log(data);
      this.historicoLista = data;
    })
  }


  async dismiss() {
    await this.modalController.dismiss();
  }
  ngOnInit() { }

  async enviarEditar() {
    const modal = await this.modalController.create({
      component: EditarAmbulantePage,
      componentProps: {
        item: this.ambulante
      }
    });

    await modal.present();
  }

  mostrarNotificacoes(){
    if(this.historico === false){
      this.historico = true;
    }
      else{
        this.historico = false;
      }
  }
  mostrarTrabalho(){
    if(this.trabalho === false){
    this.trabalho = true;
  }
    else{
      this.trabalho = false;
    }
  }

  mostrarInfor(){
    if(this.informacoes === false){
    this.informacoes = true;
  }
    else{
      this.informacoes = false;
    }
  }

  async notificar(){
    const modal = await this.modalController.create({
      component: NotificarAmbulantePage,
      componentProps: {
        id: this.ambulante['id']
      }
    });

    await modal.present();
  }

}

