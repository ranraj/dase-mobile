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

import { AssetServiceHistoryPage } from './asset-service-history';
import { AssetServiceHistoryUpdatePage } from './asset-service-history-update';
import { AssetServiceHistory, AssetServiceHistoryService, AssetServiceHistoryDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AssetServiceHistoryResolve implements Resolve<AssetServiceHistory> {
  constructor(private service: AssetServiceHistoryService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AssetServiceHistory> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<AssetServiceHistory>) => response.ok),
        map((assetServiceHistory: HttpResponse<AssetServiceHistory>) => assetServiceHistory.body)
      );
    }
    return of(new AssetServiceHistory());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AssetServiceHistoryPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AssetServiceHistoryUpdatePage,
    resolve: {
      data: AssetServiceHistoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AssetServiceHistoryDetailPage,
    resolve: {
      data: AssetServiceHistoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AssetServiceHistoryUpdatePage,
    resolve: {
      data: AssetServiceHistoryResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AssetServiceHistoryPage, AssetServiceHistoryUpdatePage, AssetServiceHistoryDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AssetServiceHistoryPageModule {}
