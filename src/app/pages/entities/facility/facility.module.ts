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

import { FacilityPage } from './facility';
import { FacilityUpdatePage } from './facility-update';
import { Facility, FacilityService, FacilityDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class FacilityResolve implements Resolve<Facility> {
  constructor(private service: FacilityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Facility> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Facility>) => response.ok),
        map((facility: HttpResponse<Facility>) => facility.body)
      );
    }
    return of(new Facility());
  }
}

const routes: Routes = [
  {
    path: '',
    component: FacilityPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FacilityUpdatePage,
    resolve: {
      data: FacilityResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FacilityDetailPage,
    resolve: {
      data: FacilityResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FacilityUpdatePage,
    resolve: {
      data: FacilityResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [FacilityPage, FacilityUpdatePage, FacilityDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class FacilityPageModule {}
