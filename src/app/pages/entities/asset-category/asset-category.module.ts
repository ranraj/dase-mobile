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

import { AssetCategoryPage } from './asset-category';
import { AssetCategoryUpdatePage } from './asset-category-update';
import { AssetCategory, AssetCategoryService, AssetCategoryDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AssetCategoryResolve implements Resolve<AssetCategory> {
  constructor(private service: AssetCategoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssetCategory> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<AssetCategory>) => response.ok),
        map((assetCategory: HttpResponse<AssetCategory>) => assetCategory.body)
      );
    }
    return of(new AssetCategory());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AssetCategoryPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetCategoryUpdatePage,
    resolve: {
      data: AssetCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetCategoryDetailPage,
    resolve: {
      data: AssetCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetCategoryUpdatePage,
    resolve: {
      data: AssetCategoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AssetCategoryPage, AssetCategoryUpdatePage, AssetCategoryDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AssetCategoryPageModule {}
