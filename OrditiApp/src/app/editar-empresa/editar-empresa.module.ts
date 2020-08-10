import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditarEmpresaPage } from './editar-empresa.page';
import { BrMaskerModule } from 'br-mask';

const routes: Routes = [
  {
    path: '',
    component: EditarEmpresaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrMaskerModule,

    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditarEmpresaPage]
})
export class EditarEmpresaPageModule {}
