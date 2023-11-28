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

import { ProductVariationBrandingPage } from './product-variation-branding';
import { ProductVariationBrandingUpdatePage } from './product-variation-branding-update';
import { ProductVariationBranding, ProductVariationBrandingService, ProductVariationBrandingDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class ProductVariationBrandingResolve implements Resolve<ProductVariationBranding> {
  constructor(private service: ProductVariationBrandingService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ProductVariationBranding> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<ProductVariationBranding>) => response.ok),
        map((productVariationBranding: HttpResponse<ProductVariationBranding>) => productVariationBranding.body)
      );
    }
    return of(new ProductVariationBranding());
  }
}

const routes: Routes = [
  {
    path: '',
    component: ProductVariationBrandingPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductVariationBrandingUpdatePage,
    resolve: {
      data: ProductVariationBrandingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductVariationBrandingDetailPage,
    resolve: {
      data: ProductVariationBrandingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductVariationBrandingUpdatePage,
    resolve: {
      data: ProductVariationBrandingResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [ProductVariationBrandingPage, ProductVariationBrandingUpdatePage, ProductVariationBrandingDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class ProductVariationBrandingPageModule {}
