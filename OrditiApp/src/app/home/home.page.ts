import { Component } from '@angular/core';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController, ModalController, NavParams, MenuController } from '@ionic/angular';
import { AppModule } from '../app.module';

import { AlertasService } from '../services/alertas.service';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';

import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';
import * as moment from 'moment';
import { SqlOrditiService } from '../services/banco/sql-orditi.service';
import { LoginBancoService } from '../services/login/login-banco.service';
import { ListaAmbulantesService } from '../services/lista-ambulantes/lista-ambulantes.service';

import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';

const iconRetinaUrl = '../../assets/leaflet/images/marker-icon-2x.png';
const iconUrl = '../../assets/leaflet/images/marker-icon.png';
const shadowUrl = '../../assets/leaflet/images/marker-shadow.png';

const LeafIcon = L.Icon.extend({
  options: {
    shadowUrl,
    iconSize: [25, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [32, 32]
  }
});

const LeafIconZone = L.Icon.extend({
  options: {
    shadowUrl,
    iconSize: [31, 40],
    shadowSize: [41, 41],
    iconAnchor: [15, 41],
    shadowAnchor: [13, 41],
    popupAnchor: [0, -41]
  }
});

const defaultIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker.png' }),
  ambulanteIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-0.png' }),
  ambulanteVerdeIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-1.png' }),
  ambulanteVermelhoIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-2.png' }),
  denunciaIcon = new LeafIcon({ iconUrl: '../../assets/leaflet/images/marker-3.png' }),
  areaIcon = new LeafIconZone({ iconUrl: '../../assets/leaflet/images/marker.png' })

// L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  count = 0;

  user: any = AppModule.getUsuario();

  map: L.map = null;
  lat: any;
  long: any;

  //Zonas da cidade
  locais: any[];

  zona: any = null;

  poli: any = polygon([], {});

  markersA: any;
  markersA1: any;
  markersA2: any;
  markersD: any;
  markersArea: any;

  poliAreas: any[]=[];


  //  qrCode
  qrData = 'Hola Mundo';
  scannedCode = null;

  elementType: 'url' | 'canvas' | 'img' = 'canvas';
  tipoUsuario: boolean = this.loginBanco.res_usuario;
  tileLayer: any[] =[];
  map_layers: any[] =[];
  ctr_layers: any[] = [];
  
  
  
  constructor(
    private sqlOrditi: SqlOrditiService,
    private geolocation: Geolocation,
    public alertas: AlertasService,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    private loginBanco: LoginBancoService,
    private menuCtrl: MenuController,
    private listaAmbulante: ListaAmbulantesService
  ) {
    this.menuCtrl.swipeEnable(false);
  }

  LeerCode() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scannedCode = barcodeData;
      console.log(barcodeData.text);
      alert(barcodeData.text);
      try {
        this.sqlOrditi.receberPerfil(this.scannedCode.text);
        this.sqlOrditi.receberPerfil(this.scannedCode.text).subscribe(data => {
          console.log(data)
          if(data[0] === undefined){
            console.log(data)
            this.alertas.presentToast('Nenhum usuário com esse código');
          }
          else{
            this.irPerfis(data[0]);
          }
        })
      } catch(err){
        console.log(err);
        this.alertas.presentToast('Nenhum usuário com esse código');
      }
    });
  }



  ionViewDidEnter() {


    if (this.map !== 'undefined' && this.map !== null) {
      this.map.remove();
    } else {
      this.loginBanco.recuperar('fiscal')
        .then((dados) => {
          if (dados !== null) {
            this.tipoUsuario = true;
            this.loginBanco.res_usuario = true;
          }
          else {
            this.tipoUsuario = false;
            this.loginBanco.res_usuario = false;
          }
        }, error => {
          this.tipoUsuario = false;
          this.loginBanco.res_usuario = false;
        });



      /** Get current position **/
      this.geolocation.getCurrentPosition().then((resp) => {
        this.lat = resp.coords.latitude;
        this.long = resp.coords.longitude;
        this.map = new Map('mapId').setView([this.lat, this.long], 30);
        this.tileLayer['Mapa'] = tileLayer('https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=C1vu4LOmp14JjyXqidSlK8rjeSlLK1W59o1GAfoHVOpuc6YB8FSNyOyHdoz7QIk6', {
          attribution: ' &copy;', maxZoom: 18
        });

        var map_layers: any[]=[];
        map_layers["Áreas"] = L.layerGroup();
        this.ctr_layers["Áreas"] = map_layers["Áreas"];

        map_layers["Status - Em dia"] = L.layerGroup();
        this.ctr_layers["Status - Em dia"] = map_layers["Status - Em dia"];

        map_layers["Status - Pendente"] = L.layerGroup();
        this.ctr_layers["Status - Pendente"] = map_layers["Status - Pendente"];

        map_layers["Status - Vencido"] = L.layerGroup();
        this.ctr_layers["Status - Vencido"] = map_layers["Status - Vencido"];

        console.log(this.tipoUsuario)
        if(this.tipoUsuario == true){
          console.log('entrou')
          map_layers["Denúncias"] = L.layerGroup();
          this.ctr_layers["Denúncias"] = map_layers["Denúncias"];
        }

        this.tileLayer['Mapa'].addTo(this.map);

        L.control.layers( this.tileLayer, this.ctr_layers, ).addTo(this.map);

        this.markersA = L.markerClusterGroup({
          polygonOptions: { stroke: false, fill: true, fillColor: "gray", fillOpacity: 0.45 }
        });
        this.markersA1 = L.markerClusterGroup({
          polygonOptions: { stroke: false, fill: true, fillColor: "gray", fillOpacity: 0.45 }
        });
        this.markersA2 = L.markerClusterGroup({
          polygonOptions: { stroke: false, fill: true, fillColor: "gray", fillOpacity: 0.45 }
        });
        this.markersD = L.markerClusterGroup({
          polygonOptions: { stroke: false, fill: true, fillColor: "gray", fillOpacity: 0.45 }
        });
        this.markersArea = L.featureGroup({
          polygonOptions: { stroke: false, fill: true, fillColor: "gray", fillOpacity: 0.45 }
        })

        //Criar Pins de Ambulantes
        this.listaAmbulante.recuperar('lista').then((data)=>{
          data.forEach(element => {
            this.criarMarkerAmbulantes(element);
            console.log(element);
          });
        }, error => {
          console.log(error);
        });;

        //Criar Pind de Zonas
        this.sqlOrditi.receberDados('http://localhost/orditiServices/listarZonas.php').subscribe(data => {
          console.log(data)
          data.forEach(element => {
            this.criarPoligono(element);
          });
        }, error => {
          console.log(error);
        });;

        var A = this.markersA;
        var A1 = this.markersA1;
        var A2 = this.markersA2;
        var D = this.markersD;
        var Area = this.markersArea;
        var poli = this.poliAreas;
        
        //
        this.map.on('overlayadd', function(this, e){
          var groupMarker = new L.MarkerClusterGroup({
            disableClusteringAtZoom: 14,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
            spiderfyOnMaxZoom: true
        });
        if(e.name === "Status - Em dia"){
          map_layers[e.name].addLayer(A1)
        }else if(e.name === "Status - Pendente"){
          map_layers[e.name].addLayer(A);
        }else if(e.name === "Status - Vencido"){
          map_layers[e.name].addLayer(A2);
        }else if(e.name === "Denúncias"){
          map_layers[e.name].addLayer(D);
        }else if(e.name === "Áreas"){
          map_layers[e.name].addLayer(Area);
          poli.forEach(element=>{
            element.addTo(map_layers[e.name]);
            console.log(element);
          });
        }
        })
        //

        this.poli.addTo(this.map);

        
        console.log("TIPO DE USUÁRIO:", this.tipoUsuario);
        //Adicionar condição para só mostrar se for fiscal
        if (this.tipoUsuario !== false) {
          this.sqlOrditi.receberDados('http://localhost/orditiServices/listarDenuncias.php').subscribe(data => {
            data.forEach(element => {
              console.log(element);
              this.criarMarkerDenuncias(element);
            });
          }, error => {
            console.log(error);
          });;

        }
        /** Criar mapa na posição atual do usuário **/
        const marker = L.marker([this.lat, this.long], { icon: defaultIcon }).addTo(this.map)
          .bindPopup('Você está aqui!') //Mensagem do ponto
          .openPopup(); //Abre a Mensagem


      }).catch((error) => {
        console.log('Error getting location', error);
        this.geolocationErrorAlert();
      });
    }
  }

  /** Remove map when we have multiple map object **/
  ionViewWillLeave() {
    this.map.remove();
  }

  // retornar local atual
  localAtual() {
    this.map.setView([this.lat, this.long], 30);
  }

  criarMarkerAmbulantes(geo) {

    console.log(geo);

    var ambulanteFoto = geo['foto'];
    var ambulanteNome = geo['nome'];
    var ambulanteProduto = geo['produto'];
    var ambulanteLat = geo['latitude'];
    var ambulantLong = geo['longitude'];
    var ambulanteStatus = geo['situacao'];
    if (ambulanteStatus === '1') {
      var amb = L.marker([ambulanteLat, ambulantLong], { icon: ambulanteVerdeIcon }).bindPopup('<img src="' + ambulanteFoto + '"><br>' + 'Ambulante: <strong>' + ambulanteNome + '</strong><br>Produto: <strong>' + ambulanteProduto + '</strong>').openPopup();
      amb.addTo(this.markersA1);
    }
    if (ambulanteStatus === '2') {
      var amb = L.marker([ambulanteLat, ambulantLong], { icon: ambulanteVermelhoIcon }).bindPopup('<img src="' + ambulanteFoto + '"><br>' + 'Ambulante: <strong>' + ambulanteNome + '</strong><br>Produto: <strong>' + ambulanteProduto + '</strong>').openPopup();
      amb.addTo(this.markersA2);
    }
    if (ambulanteStatus === '0') {
      var amb = L.marker([ambulanteLat, ambulantLong], { icon: ambulanteIcon }).bindPopup('<img src="' + ambulanteFoto + '"><br>' + 'Ambulante: <strong>' + ambulanteNome + '</strong><br>Produto: <strong>' + ambulanteProduto + '</strong>').openPopup();
      amb.addTo(this.markersA);
    }
    
  }

  criarMarkerDenuncias(den) {
    console.log(den);
    var denunciaFoto = den['foto'];
    var denunciaLat = den['latitude'];
    var denunciaLong = den['longitude'];
    var denunciaInfo = den['descricao'];
    var denunciaData = moment(den.dataDenuncia).format('DD/MM/YYYY');
    var denMarker = L.marker([denunciaLat, denunciaLong], { icon: denunciaIcon }).bindPopup('<strong>Denuncia feita<br>' + denunciaData + '<img src="' + denunciaFoto + '"><br>  Diz: ' + denunciaInfo + '</strong>').openPopup();
    denMarker.addTo(this.markersD);
  }

  criarPoligono(doc) {
    var coordenadas = doc['centroide']
    var area = [coordenadas[1], coordenadas[0]];
    //Constrói a matriz area com arrays de coordenadas(latitude e longitude)
    var zona = doc['poligono'];
    var arealist = []
    for (var ponto in zona) {
      var a = zona[ponto]
      arealist.push([a[1], a[0]])
    }
    //Constrói um poligono com as coordenadas presentes em 'area'
    var regiao = polygon(arealist, { color: '#f5a42c', fillColor: '#f5a42c'  });

    var markerArea = L.marker(area, { icon: ambulanteIcon }).bindPopup(doc['nome']).on('click', (e) => { this.regiaoClicada(doc); });
    if(doc['quantidade_ambulantes']<=49/100*doc['limite_ambulantes']){
      markerArea = L.marker(area, { icon: ambulanteVerdeIcon }).bindPopup(doc['nome']).on('click', (e) => { this.regiaoClicada(doc); });
      regiao = polygon(arealist, { color: '#5ea9a4', fillColor: '#5ea9a4'});
    } else if(doc['quantidade_ambulantes']>=99/100*doc['limite_ambulantes']){
      markerArea = L.marker(area, { icon: ambulanteVermelhoIcon }).bindPopup(doc['nome']).on('click', (e) => { this.regiaoClicada(doc); });
      regiao = polygon(arealist, { color: '#ed2e54', fillColor: '#ed2e54' });
    }
    markerArea.addTo(this.markersArea);
 
    this.poliAreas.push(regiao);
  }

  /** Create an alert when geolocation function fails **/
  async geolocationErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Erro',
      subHeader: 'Não foi possível definir a localização',
      buttons: ['OK']
    });
    await alert.present();
  }

  async mostraDetalhes() {
    var zona = this.zona;
    console.log('click')
    const modal = await this.modalCtrl.create({
      component: DetalheZonaPage,
      componentProps: {
        info: zona,
        foto: '../../assets/img/Região.jpg'
      }
    });
    return await modal.present();
    //this.alertas.presentModal(DetalheZonaPage, this.zona);
  }

  regiaoClicada(doc) {
  
    JSON.stringify(doc);
    this.zona = doc;
    console.log(doc);
    //regiao.on('click', (e) => { this.regiaoClicada(doc); });
    //Adiciona o polígono ao mapa com um popup que aparece ao clicar no polígono
    //this.poli.setStyle({ opacity: 0.0 })
    //this.poli = regiao;
    //this.poli.addTo(this.map);
    this.poli.bindPopup(doc['nome'] + ': ' + doc['limite_ambulante']);
  }

  fecharCard() {
    this.poli.setStyle({ opacity: 0.0 })
    this.zona = null;
  }


  async irPerfis(item) {
    const modal = await this.modalCtrl.create({
      component: PerfilAmbulantePage,
      componentProps: {
        info: item
      }
    });

    await modal.present();


  }



}
