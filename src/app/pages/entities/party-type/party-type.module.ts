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

import { PartyTypePage } from './party-type';
import { PartyTypeUpdatePage } from './party-type-update';
import { PartyType, PartyTypeService, PartyTypeDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class PartyTypeResolve implements Resolve<PartyType> {
  constructor(private service: PartyTypeService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PartyType> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<PartyType>) => response.ok),
        map((partyType: HttpResponse<PartyType>) => partyType.body)
      );
    }
    return of(new PartyType());
  }
}

const routes: Routes = [
  {
    path: '',
    component: PartyTypePage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PartyTypeUpdatePage,
    resolve: {
      data: PartyTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PartyTypeDetailPage,
    resolve: {
      data: PartyTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PartyTypeUpdatePage,
    resolve: {
      data: PartyTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [PartyTypePage, PartyTypeUpdatePage, PartyTypeDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class PartyTypePageModule {}
