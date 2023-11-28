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

import { CatalogPage } from './catalog';
import { CatalogUpdatePage } from './catalog-update';
import { Catalog, CatalogService, CatalogDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class CatalogResolve implements Resolve<Catalog> {
  constructor(private service: CatalogService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Catalog> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Catalog>) => response.ok),
        map((catalog: HttpResponse<Catalog>) => catalog.body)
      );
    }
    return of(new Catalog());
  }
}

const routes: Routes = [
  {
    path: '',
    component: CatalogPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CatalogUpdatePage,
    resolve: {
      data: CatalogResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CatalogDetailPage,
    resolve: {
      data: CatalogResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CatalogUpdatePage,
    resolve: {
      data: CatalogResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [CatalogPage, CatalogUpdatePage, CatalogDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class CatalogPageModule {}
