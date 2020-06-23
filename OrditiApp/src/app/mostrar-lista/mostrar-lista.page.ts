import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, AlertController } from '@ionic/angular';
import { ListaAmbulantesService } from '../services/lista-ambulantes/lista-ambulantes.service';

@Component({
  selector: 'app-mostrar-lista',
  templateUrl: './mostrar-lista.page.html',
  styleUrls: ['./mostrar-lista.page.scss'],
})
export class MostrarListaPage implements OnInit {

  lista: any;

  constructor(
    public modalController: ModalController,
    private listaAmbulante: ListaAmbulantesService,
    public alertController: AlertController,
    public navParam: NavParams,
  ) {
    this.lista = this.navParam.get('lista');
  }

  ngOnInit() {
  }

  async dismiss() {
    await this.modalController.dismiss();
  }

  salvarLista() {
    this.presentAlertSalvar()
  }

  async presentAlertSalvar() {
    var resp: string = ' ';

    const alert = await this.alertController.create({
      header: 'Atenção',
      message: "Deseja apagar a lista anterior e salvar essa?",
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',

        }, {
          text: 'Adicionar',
          handler: async () => {
            this.listaAmbulante.remover('lista1');
            this.listaAmbulante.inserir('lista1', this.lista);
          }
        }
      ]
    });

    await alert.present();
    return resp;
  }

}
