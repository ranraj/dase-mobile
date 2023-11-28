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

import { OrderItemPage } from './order-item';
import { OrderItemUpdatePage } from './order-item-update';
import { OrderItem, OrderItemService, OrderItemDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class OrderItemResolve implements Resolve<OrderItem> {
  constructor(private service: OrderItemService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<OrderItem> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<OrderItem>) => response.ok),
        map((orderItem: HttpResponse<OrderItem>) => orderItem.body)
      );
    }
    return of(new OrderItem());
  }
}

const routes: Routes = [
  {
    path: '',
    component: OrderItemPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrderItemUpdatePage,
    resolve: {
      data: OrderItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrderItemDetailPage,
    resolve: {
      data: OrderItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrderItemUpdatePage,
    resolve: {
      data: OrderItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [OrderItemPage, OrderItemUpdatePage, OrderItemDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class OrderItemPageModule {}
