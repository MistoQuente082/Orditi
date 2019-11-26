import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PerfilAmbulantePage } from './perfil-ambulante.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilAmbulantePage
  }
];

@NgModule({
  entryComponents: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PerfilAmbulantePage]
})
export class PerfilAmbulantePageModule { }
