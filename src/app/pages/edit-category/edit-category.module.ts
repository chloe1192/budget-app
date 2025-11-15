import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditCategoryPageRoutingModule } from './edit-category-routing.module';

import { EditCategoryPage } from './edit-category.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EditCategoryPageRoutingModule
  ],
  declarations: [EditCategoryPage]
})
export class EditCategoryPageModule {}
