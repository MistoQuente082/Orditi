import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
	selector: 'app-mapa-modal',
	templateUrl: './mapa-modal.page.html',
	styleUrls: ['./mapa-modal.page.scss'],
})
export class MapaModalPage implements OnInit {
	map: Map = null;
	lat: any;
	long: any;
	latlng: any;

	origem: any;

	L: any = null;
	local: any;

	constructor(public modalController: ModalController,
		private geolocation: Geolocation,
		public alertController: AlertController,
		navParams: NavParams,
		public db: AngularFirestore) {
		this.origem = navParams.get('origem');
	}

	ngOnInit() {
		this.leafletMap();
	}

	closeModal() {
		this.modalController.dismiss();
	}

	/** Load leaflet map **/
	leafletMap() {
		if (this.map !== 'undefined' && this.map !== null) {
			this.map.remove();
		}
		else {
			/** Get current position **/
			this.geolocation.getCurrentPosition().then((resp) => {
				this.lat = resp.coords.latitude;
				this.long = resp.coords.longitude;

				this.map = new Map('mapId').setView([this.lat, this.long], 20);
				this.map.on('click', (e) => { this.mapMarker(e); });

				tileLayer('https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png', {
					attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
				}).addTo(this.map);

				/** Criar poligonos a partir de dados do firebase */
				//Código de acesso à coleção das zonas no firebase 
				this.db.collection('zonas').get().toPromise().then(snapshot => {
					snapshot.forEach(doc => {
						this.criarPoligono(doc);
					})
				})
				//Fim do acesso ao Firebasse

			}).catch((error) => {
				console.log('Error getting location', error);
			});
		}
	}

	mapMarker(e) {
		console.log("Objeto: ", e);
		console.log("Latlng: ", e.latlng);
		console.log("Lat: ", e.latlng.lat);
		console.log("Lng: ", e.latlng.lng);
		if (this.L !== null) {
			this.map.removeLayer(this.L);
		}
		this.L = marker(e.latlng)
		this.L.addTo(this.map).bindPopup('Você selecionou esse ponto').openPopup();
		this.local = e.latlng;

		//Faz aparecer no mapa
	}

	confirmar() {
		//Põe o alert de confirmação aqui
		console.log('enviando: ' + this.local);
		this.origem.setLocal(this.local);
	}

	criarPoligono(doc) {
		var zona = doc.data().coordenadas;
		var area = [];
		//Constrói a matriz area com arrays de coordenadas(latitude e longitude)
		for (var ponto in zona) {
			area.push([zona[ponto].latitude, zona[ponto].longitude])
		}
		//Testando
		//Constrói um poligono com as coordenadas presentes em 'area'
		var regiao = polygon(area);
		regiao.on('click', (e) => { this.regiaoClicada(regiao, doc); });
		//Adiciona o polígono ao mapa com um popup que aparece ao clicar no polígono
		regiao.addTo(this.map);
		regiao.bindPopup(doc.data().nome + ': ' + doc.data().capacidade);
		console.log('Criando polígonos');
	}

	async presentAlert(e) {
		const alert = await this.alertController.create({
			header: 'Sucesso!',
			message: 'A nova foto foi adicionada com sucesso.',
			buttons: ['OK']
		});

		await alert.present();
	}

	regiaoClicada(regiao, doc) {
		if (this.L !== null) {
			this.map.removeLayer(this.L);
		}
		doc.bindPopup('Você selecionou esse ponto').openPopup();
	}

}
