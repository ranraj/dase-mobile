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

import { OrganisationPage } from './organisation';
import { OrganisationUpdatePage } from './organisation-update';
import { Organisation, OrganisationService, OrganisationDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class OrganisationResolve implements Resolve<Organisation> {
  constructor(private service: OrganisationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Organisation> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<Organisation>) => response.ok),
        map((organisation: HttpResponse<Organisation>) => organisation.body)
      );
    }
    return of(new Organisation());
  }
}

const routes: Routes = [
  {
    path: '',
    component: OrganisationPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: OrganisationUpdatePage,
    resolve: {
      data: OrganisationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: OrganisationDetailPage,
    resolve: {
      data: OrganisationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: OrganisationUpdatePage,
    resolve: {
      data: OrganisationResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [OrganisationPage, OrganisationUpdatePage, OrganisationDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class OrganisationPageModule {}
