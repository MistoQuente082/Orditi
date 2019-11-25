import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';

import { NgxQRCodeModule } from 'ngx-qrcode2';

@NgModule({
  entryComponents: [
    DetalheZonaPage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxQRCodeModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    DetalheZonaPage,
    HomePage
  ]
})
export class HomePageModule { }
