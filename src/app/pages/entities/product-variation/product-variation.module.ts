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

import { ProductVariationPage } from './product-variation';
import { ProductVariationUpdatePage } from './product-variation-update';
import { ProductVariation, ProductVariationService, ProductVariationDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ProductVariationResolve implements Resolve<ProductVariation> {
  constructor(private service: ProductVariationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductVariation> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductVariation>) => response.ok),
        map((productVariation: HttpResponse<ProductVariation>) => productVariation.body)
      );
    }
    return of(new ProductVariation());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ProductVariationPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductVariationUpdatePage,
    resolve: {
      data: ProductVariationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductVariationDetailPage,
    resolve: {
      data: ProductVariationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductVariationUpdatePage,
    resolve: {
      data: ProductVariationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ProductVariationPage, ProductVariationUpdatePage, ProductVariationDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ProductVariationPageModule {}
