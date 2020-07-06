import { Component, OnInit } from '@angular/core';
import { AlertasService } from '../services/alertas.service';
import { NavParams, ModalController } from '@ionic/angular';

import * as moment from 'moment';

import { Router } from '@angular/router';

import * as L from 'leaflet';
import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';


import { EditarAmbulantePage } from '../editar-ambulante/editar-ambulante.page';
import { NotificarAmbulantePage } from '../notificar-ambulante/notificar-ambulante.page';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';

const shadowUrl = '../../assets/leaflet/images/marker-shadow.png';

const LeafIcon = L.Icon.extend({
  // iconRetinaUrl,
  // iconUrl,
  options: {
    shadowUrl,
    iconSize: [25, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [32, 32]
  }
});
const ambulanteIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/ambulante-amarelo2.png' }),
  ambulanteVerdeIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/ambulante-verde.png' }),
  ambulanteVermelhoIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/ambulante-vermelho.png' });



@Component({
  selector: 'app-perfil-ambulante',
  templateUrl: './perfil-ambulante.page.html',
  styleUrls: ['./perfil-ambulante.page.scss'],
})
export class PerfilAmbulantePage implements OnInit {
  historico: boolean = false;
  trabalho: boolean = true;
  informacoes: boolean = false;

  produtos: any[] = ['Alimentos', 'Bebidas não alcoólicas', 'Bebidas Alcoólicas', 'Briquedos e Ornamentos', 'Confecções, Calçados, Artigos de uso pessoal', 'Louças, Ferragens, Artefatos, Utensílios Domésticos', 'Artesanato, Antiguidades e arte', 'Outros'];

  historicoLista: any[] = [];
  ambulante: any;
  map: any;
  mostrarMapa: boolean = false;
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
    this.sqlOrditi.receberNotificacoes(this.ambulante['id']).subscribe(data => {
      console.log(data)
      data.forEach(e => {
        e.data_notificacao = moment(e.data_notificacao).format('DD/MM/YYYY');
      }
      )
      console.log(data);
      this.historicoLista = data;
    })
  }


  async dismiss() {
    await this.modalController.dismiss();
  }
  ngOnInit() {
    
  }


  criarMarkerAmbulantes(geo) {


    var ambulanteLat = geo['latitude'];
    var ambulantLong = geo['longitude'];
    var ambulanteStatus = geo['situacao'];
    var ambulanteFotoEquipamento = geo['foto_equipamento'];

    if (ambulanteStatus === '1') {
      var amb = L.marker([ambulanteLat, ambulantLong], { icon: ambulanteVerdeIcon })
        .bindPopup('<img src="' + ambulanteFotoEquipamento + '">')
        .openPopup();
      amb.addTo(this.map);
    }
    if (ambulanteStatus === '2') {
      var amb = L.marker([ambulanteLat, ambulantLong], { icon: ambulanteVermelhoIcon }).bindPopup('<img src="' + ambulanteFotoEquipamento + '">').openPopup();
      amb.addTo(this.map);
    }
    if (ambulanteStatus === '0') {
      var amb = L.marker([ambulanteLat, ambulantLong], { icon: ambulanteIcon }).bindPopup('<img src="' + ambulanteFotoEquipamento + '">').openPopup();
      amb.addTo(this.map);
    }



  }
  async enviarEditar() {
    const modal = await this.modalController.create({
      component: EditarAmbulantePage,
      componentProps: {
        item: this.ambulante
      }
    });

    await modal.present();
  }
  leafletMap(ambulante) {

    this.mostrarMapa = true;
    if (this.map !== 'undefined' && this.map !== null) {
      this.map = null;
    }
    else {


      this.map = new Map('mapId').setView([ambulante.latitude, ambulante.longitude], 18);


      tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; ', maxZoom: 18
      }).addTo(this.map);

      this.criarMarkerAmbulantes(ambulante);
    }
  }
  mostrarNotificacoes() {
    if (this.historico === false) {
      this.historico = true;
    }
    else {
      this.historico = false;
    }
  }
  mostrarTrabalho() {
    if (this.trabalho === false) {
      this.trabalho = true;


    }
    else {
      this.trabalho = false;
    }
  }

  mostrarInfor() {
    if (this.informacoes === false) {
      this.informacoes = true;
    }
    else {
      this.informacoes = false;
    }
  }

  async notificar() {
    const modal = await this.modalController.create({
      component: NotificarAmbulantePage,
      componentProps: {
        id: this.ambulante['id']
      }
    });

    await modal.present();
  }

}

