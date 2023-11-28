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

import { AssetItemTypePage } from './asset-item-type';
import { AssetItemTypeUpdatePage } from './asset-item-type-update';
import { AssetItemType, AssetItemTypeService, AssetItemTypeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AssetItemTypeResolve implements Resolve<AssetItemType> {
  constructor(private service: AssetItemTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssetItemType> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<AssetItemType>) => response.ok),
        map((assetItemType: HttpResponse<AssetItemType>) => assetItemType.body)
      );
    }
    return of(new AssetItemType());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AssetItemTypePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetItemTypeUpdatePage,
    resolve: {
      data: AssetItemTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetItemTypeDetailPage,
    resolve: {
      data: AssetItemTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetItemTypeUpdatePage,
    resolve: {
      data: AssetItemTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AssetItemTypePage, AssetItemTypeUpdatePage, AssetItemTypeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AssetItemTypePageModule {}
