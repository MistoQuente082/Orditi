import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController } from '@ionic/angular';

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

	constructor(public modalController: ModalController,
		private geolocation: Geolocation,
		public alertController: AlertController,
		navParams: NavParams,
	) {
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
				this.map.on('click', function (e) { mapMarker(e); });

				tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>', maxZoom: 18
				}).addTo(this.map);

				function mapMarker(e) {
					console.log("Objeto: ", e);
					console.log("Latlng: ", e.latlng);
					console.log("Lat: ", e.latlng.lat);
					console.log("Lng: ", e.latlng.lng);
					//marker(e.latlng).addTo(this.map);
					//Faz aparecer no mapa
					this.origem.setLocal(e);
				}

			}).catch((error) => {
				console.log('Error getting location', error);
			});
		}
	}

	async presentAlert(e) {
		const alert = await this.alertController.create({
			header: 'Sucesso!',
			message: 'A nova foto foi adicionada com sucesso.',
			buttons: ['OK']
		});

		await alert.present();
	}

}
