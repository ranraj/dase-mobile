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

import { PartyRolePage } from './party-role';
import { PartyRoleUpdatePage } from './party-role-update';
import { PartyRole, PartyRoleService, PartyRoleDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class PartyRoleResolve implements Resolve<PartyRole> {
  constructor(private service: PartyRoleService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PartyRole> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PartyRole>) => response.ok),
        map((partyRole: HttpResponse<PartyRole>) => partyRole.body)
      );
    }
    return of(new PartyRole());
  }
}

const routes: Routes = [
  {
    path: '',
    component: PartyRolePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyRoleUpdatePage,
    resolve: {
      data: PartyRoleResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyRoleDetailPage,
    resolve: {
      data: PartyRoleResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyRoleUpdatePage,
    resolve: {
      data: PartyRoleResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PartyRolePage, PartyRoleUpdatePage, PartyRoleDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class PartyRolePageModule {}
