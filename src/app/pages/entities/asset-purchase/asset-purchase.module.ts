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

import { AssetPurchasePage } from './asset-purchase';
import { AssetPurchaseUpdatePage } from './asset-purchase-update';
import { AssetPurchase, AssetPurchaseService, AssetPurchaseDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AssetPurchaseResolve implements Resolve<AssetPurchase> {
  constructor(private service: AssetPurchaseService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssetPurchase> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<AssetPurchase>) => response.ok),
        map((assetPurchase: HttpResponse<AssetPurchase>) => assetPurchase.body)
      );
    }
    return of(new AssetPurchase());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AssetPurchasePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetPurchaseUpdatePage,
    resolve: {
      data: AssetPurchaseResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetPurchaseDetailPage,
    resolve: {
      data: AssetPurchaseResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetPurchaseUpdatePage,
    resolve: {
      data: AssetPurchaseResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AssetPurchasePage, AssetPurchaseUpdatePage, AssetPurchaseDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AssetPurchasePageModule {}
