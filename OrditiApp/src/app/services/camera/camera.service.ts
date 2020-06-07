import { Injectable } from '@angular/core';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  public imgPessoa: string;
  public imgDato: string;
  public imagem: string;


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
          this.tirarFoto();
          console.log('Tirar foto clicked');
        }
      }, {
        text: 'Escolher da Galeria',
        icon: 'images',
        handler: () => {
          console.log('escolher Foto clicked');
          this.escolherFoto();

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
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
    };

    this.camera.getPicture(options)
      .then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):

        //this.imagem = this.webView.convertFileSrc(imageData);
        this.imagem = 'data:image/jpeg;base64,' + imageData;
        this.imgDato = imageData;
        console.log('imgDato - escolher')
      }, (err) => {
        // Handle error
      });


  }

  // Função para camera
  tirarFoto() {
    console.log('Tirar foto')
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      saveToPhotoAlbum: false,
    };

    this.camera.getPicture(options)
      .then((imageData) => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):

        //this.imagem = this.webView.convertFileSrc(imageData);
        return this.imagem = 'data:image/jpeg;base64,' + imageData;
        this.imgDato = imageData;
        console.log('foto tirada')
      }, (err) => {
        // Handle error
      });


  }

}
