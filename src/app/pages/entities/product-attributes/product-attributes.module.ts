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

import { ProductAttributesPage } from './product-attributes';
import { ProductAttributesUpdatePage } from './product-attributes-update';
import { ProductAttributes, ProductAttributesService, ProductAttributesDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ProductAttributesResolve implements Resolve<ProductAttributes> {
  constructor(private service: ProductAttributesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductAttributes> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductAttributes>) => response.ok),
        map((productAttributes: HttpResponse<ProductAttributes>) => productAttributes.body)
      );
    }
    return of(new ProductAttributes());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ProductAttributesPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductAttributesUpdatePage,
    resolve: {
      data: ProductAttributesResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductAttributesDetailPage,
    resolve: {
      data: ProductAttributesResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductAttributesUpdatePage,
    resolve: {
      data: ProductAttributesResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ProductAttributesPage, ProductAttributesUpdatePage, ProductAttributesDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ProductAttributesPageModule {}
