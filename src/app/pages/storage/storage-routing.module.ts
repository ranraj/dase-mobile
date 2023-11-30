import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorageComponent } from './storage.component';
import { StorageUpdateComponent } from './storage-update/storage-update.component';

const routes: Routes = [
  {
    path: '',
    component: StorageComponent,
  },
  {
    path: 'explore',
    component: StorageUpdateComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageRoutingModule { }
