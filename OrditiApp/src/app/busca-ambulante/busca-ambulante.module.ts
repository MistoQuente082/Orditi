import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BuscaAmbulantePage } from './busca-ambulante.page';

const routes: Routes = [
  {
    path: '',
    component: BuscaAmbulantePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BuscaAmbulantePage]
})
export class BuscaAmbulantePageModule {}
