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

import { AddressPage } from './address';
import { AddressUpdatePage } from './address-update';
import { Address, AddressService, AddressDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class AddressResolve implements Resolve<Address> {
  constructor(private service: AddressService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Address> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Address>) => response.ok),
        map((address: HttpResponse<Address>) => address.body)
      );
    }
    return of(new Address());
  }
}

const routes: Routes = [
  {
    path: '',
    component: AddressPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AddressUpdatePage,
    resolve: {
      data: AddressResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AddressDetailPage,
    resolve: {
      data: AddressResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AddressUpdatePage,
    resolve: {
      data: AddressResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [AddressPage, AddressUpdatePage, AddressDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class AddressPageModule {}
