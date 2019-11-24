import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BuscaPage } from './busca.page';
import { BrMaskerModule } from 'br-mask';
import { DetalheZonaPage } from '../detalhe-zona/detalhe-zona.page';
import { PerfilAmbulantePage } from '../perfil-ambulante/perfil-ambulante.page';

const routes: Routes = [
  {
    path: '',
    component: BuscaPage
  }
];

@NgModule({
  entryComponents: [
  ],
  imports: [
    BrMaskerModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BuscaPage,
  ]
})
export class BuscaPageModule { }
