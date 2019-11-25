import { Injectable } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  public imgPessoa: string;


  constructor(
    public webView: WebView,
    public actionSheetController: ActionSheetController,
    public camera: Camera) { }

  // MOSTRA OPÇÕES PARA IMAGEM
  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Escolher Foto',
      buttons: [{
        text: 'Capturar Imagem',
        icon: 'camera',
        handler: () => {
          this.escolherFoto();
          console.log('Share clicked');
        }
      }, {
        text: 'Escolher da Galeria',
        icon: 'images',
        handler: () => {
          console.log('Play clicked');
          this.tirarFoto();

        }
      }]
    });
    await actionSheet.present();
  }


  // Função para camera
  escolherFoto() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };

    this.camera.getPicture(options)
      .then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):

        //this.imgPessoa = this.webView.convertFileSrc(imageData);
        this.imgPessoa = 'data:image/jpeg;base64,' + imageData;
      }, (err) => {
        // Handle error
      });


  }

    // Função para camera
    tirarFoto() {
      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: this.camera.PictureSourceType.CAMERA
      };
  
      this.camera.getPicture(options)
        .then((imageData) => {
          // imageData is either a base64 encoded string or a file URI
          // If it's base64 (DATA_URL):
  
          //this.imgPessoa = this.webView.convertFileSrc(imageData);
          this.imgPessoa = 'data:image/jpeg;base64,' + imageData;
        }, (err) => {
          // Handle error
        });
  
  
    }

}
