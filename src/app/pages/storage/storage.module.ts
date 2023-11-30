import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StorageRoutingModule } from './storage-routing.module';
import { StorageComponent } from './storage.component';
import { StorageDashboardComponent } from './storage-dashboard/storage-dashboard.component';
import { StorageUpdateComponent } from './storage-update/storage-update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [StorageComponent, StorageDashboardComponent, StorageUpdateComponent],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, StorageRoutingModule, FormsModule, TranslateModule],
  bootstrap: [StorageComponent],
})
export class StorageModule { }
