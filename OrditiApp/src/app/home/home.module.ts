import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';

@NgModule({
  entryComponents: [
    DetalheZonaPage,
    PerfilAmbulantePage
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [
    DetalheZonaPage,
    HomePage,
    PerfilAmbulantePage
  ]
})
export class HomePageModule { }
