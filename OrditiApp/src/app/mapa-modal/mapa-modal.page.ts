import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { Map, latLng, tileLayer, Layer, marker, circle, Icon, polygon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { CadastroPage } from '../cadastro/cadastro.page';
import { DenunciaPage } from '../denuncia/denuncia.page';

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
		navParams: NavParams,
		public db: AngularFirestore,
		private geolocation: Geolocation,
		private nativeGeocoder: NativeGeocoder,
		public alertController: AlertController, ) {
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

	pesquisarMapaMarker(e) {
		console.log("Cidade: ", e);
		let options: NativeGeocoderOptions = {
			useLocale: true,
			maxResults: 5
		};

		this.nativeGeocoder.forwardGeocode(e, options)
			.then((result: NativeGeocoderResult[]) => {
				console.log("Geocoder result: ", result);
				if (this.L !== null) {
					this.map.removeLayer(this.L);
				}
				this.L = marker(result[0].latitude, result[0].longitude);
				this.L.addTo(this.map).bindPopup('Você selecionou esse ponto').openPopup();
			}).catch((error: any) => { console.log(error); });
	}

	async pesquisarMapa() {
		const alert = await this.alertController.create({
			header: 'Pesquisar local',
			inputs: [
				{
					name: "cidade",
					placeholder: "Cidade",
				},
			],
			buttons: [
				{
					text: "Salvar",
					handler: data => { this.pesquisarMapaMarker(data.cidade); }
				}
			]
		});

		await alert.present();
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
		regiao.bindPopup('Você selecionou: ' + doc.data().nome).openPopup();
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
		// this.local = e.latlng;

		let options: NativeGeocoderOptions = {
			useLocale: true,
			maxResults: 5
		};

		var objeto;

		this.nativeGeocoder.reverseGeocode(e.latlng.lat, e.latlng.lng, options)
			.then((result: NativeGeocoderResult[]) => {
				this.geocoderTeste(result[0].countryName, result[0].postalCode, result[0].administrativeArea, result[0].subAdministrativeArea, result[0].subLocality, result[0].thoroughfare);
				objeto = JSON.parse('{"latitude": ' + e.latlng.lat + ', "longitude": ' + e.latlng.lng + ',"pais": ' + result[0].countryName + ', "cep": ' + result[0].postalCode + ', "estado": ' + result[0].administrativeArea + ', "cidade": ' + result[0].subAdministrativeArea + ', "conjunto": ' + result[0].subLocality + ', "rua": ' + result[0].thoroughfare + '}');
			})
			.catch((error: any) => {
				this.geocoderTesteError(error);
			});

		var data = JSON.stringify(objeto);
		if (this.origem === "cadastro") {
			CadastroPage.setLocal(data)
		}
		this.local = data;
		console.log('enviando: ' + this.local + "Para: " + this.origem);
	}

	confirmar() {
		//Põe o alert de confirmação aqui

		this.origem.setLocal(this.local);
	}

	async geocoderTeste(e, f, g, h, i, j) {
		const alert = await this.alertController.create({
			header: "Localização: ",
			message: "  " + e + "  " + f + "  " + g + "  " + h + "  " + i + "  " + j,
			buttons: ['OK']
		});

		await alert.present();
	}

	async geocoderTesteError(e) {
		const alert = await this.alertController.create({
			header: 'Erro',
			message: '' + e,
			buttons: ['OK']
		});

		await alert.present();
	}

}
