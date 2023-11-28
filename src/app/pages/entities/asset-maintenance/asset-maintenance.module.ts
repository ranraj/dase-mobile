import { NgModule, Injectable } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserRouteAccessService } from '../../../services/auth/user-route-access.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { filter, map } from 'rxjs/operators';

import { AssetMaintenancePage } from './asset-maintenance';
import { AssetMaintenanceUpdatePage } from './asset-maintenance-update';
import { AssetMaintenance, AssetMaintenanceService, AssetMaintenanceDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AssetMaintenanceResolve implements Resolve<AssetMaintenance> {
  constructor(private service: AssetMaintenanceService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssetMaintenance> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<AssetMaintenance>) => response.ok),
        map((assetMaintenance: HttpResponse<AssetMaintenance>) => assetMaintenance.body)
      );
    }
    return of(new AssetMaintenance());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AssetMaintenancePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetMaintenanceUpdatePage,
    resolve: {
      data: AssetMaintenanceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetMaintenanceDetailPage,
    resolve: {
      data: AssetMaintenanceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetMaintenanceUpdatePage,
    resolve: {
      data: AssetMaintenanceResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AssetMaintenancePage, AssetMaintenanceUpdatePage, AssetMaintenanceDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AssetMaintenancePageModule {}
