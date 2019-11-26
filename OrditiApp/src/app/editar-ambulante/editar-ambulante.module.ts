import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditarAmbulantePage } from './editar-ambulante.page';

const routes: Routes = [
  {
    path: '',
    component: EditarAmbulantePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditarAmbulantePage]
})
export class EditarAmbulantePageModule { }
