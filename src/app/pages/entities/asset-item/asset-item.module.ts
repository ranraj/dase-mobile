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

import { AssetItemPage } from './asset-item';
import { AssetItemUpdatePage } from './asset-item-update';
import { AssetItem, AssetItemService, AssetItemDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AssetItemResolve implements Resolve<AssetItem> {
  constructor(private service: AssetItemService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssetItem> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<AssetItem>) => response.ok),
        map((assetItem: HttpResponse<AssetItem>) => assetItem.body)
      );
    }
    return of(new AssetItem());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AssetItemPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetItemUpdatePage,
    resolve: {
      data: AssetItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetItemDetailPage,
    resolve: {
      data: AssetItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetItemUpdatePage,
    resolve: {
      data: AssetItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AssetItemPage, AssetItemUpdatePage, AssetItemDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AssetItemPageModule {}
