import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';

import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { AppModule } from '../app.module';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {
	loading: HTMLIonLoadingElement;

	matricula: string;
	senha: string;

	user: any = AppModule.getUsuario();

	constructor(public router: Router,
		public fAuth: AngularFireAuth,
		public loadingController: LoadingController,
		public db: AngularFirestore,
	) { }

	async fazerLogin() {
		console.log('Tentando fazer login:')
		const { matricula, senha } = this;

		var user: any;

		await this.presentLoading();//Carregamento enquanto espera

		try {
			//Autenticação por email e senha
			//await this.fAuth.auth.signInWithEmailAndPassword(email, senha); 
			//const currentUser = firebase.auth().currentUser; -> Define o usuario como aquele logado
			user = this.db.collection('fiscais').doc(matricula).get().toPromise()
				.then(dados => {
					if (!dados.exists) { //Checa se existe um documento no local indicado
						console.log('Matrícula não encontrada');
					} else { //Ou seja, há um fiscal cadastrado com essa matrícula
						console.log('Matrícula encontrada')
						user = dados.data();
						if (senha === user.senha) { //Checa se as senhas batem
							console.log('Usuário logado!' + user.senha)
							AppModule.setUsuario(user); //Trocar this.usuario por uma variável global de usuário

							console.log(AppModule.getUsuario());

							this.returnHome();

						} else {
							console.log('Senha Incorreta!')
						}
					}
				})
				.catch(err => {
					console.log('Erro encontrado: ' + err);
				});

		} catch (err) {

			//Erros usando o FirebaseAuth
			//if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
			//	console.log('User not found');
			//	this.loading.dismiss();
			//	this.presentToast('Email ou senha invalido!');
			//}

			console.log('Erro encontrado ao conectar-se ao banco de dados: ' + err)

		} finally {
			//Encerra o carregamento
			this.loading.dismiss();
		}
	}

	async presentLoading() {
		this.loading = await this.loadingController.create({ message: 'Aguarde...' });
		return this.loading.present();
	}

	ngOnInit() {
	}

	routes = [
		{
			path: '',
			redirectTo: 'home'
		}
	];

	returnHome() {
		this.router.navigate(['/home']);
	}
}
