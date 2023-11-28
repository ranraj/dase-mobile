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

import { AssetPage } from './asset';
import { AssetUpdatePage } from './asset-update';
import { Asset, AssetService, AssetDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AssetResolve implements Resolve<Asset> {
  constructor(private service: AssetService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Asset> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Asset>) => response.ok),
        map((asset: HttpResponse<Asset>) => asset.body)
      );
    }
    return of(new Asset());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AssetPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetUpdatePage,
    resolve: {
      data: AssetResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetDetailPage,
    resolve: {
      data: AssetResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetUpdatePage,
    resolve: {
      data: AssetResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AssetPage, AssetUpdatePage, AssetDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AssetPageModule {}
