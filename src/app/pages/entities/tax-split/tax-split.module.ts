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

import { TaxSplitPage } from './tax-split';
import { TaxSplitUpdatePage } from './tax-split-update';
import { TaxSplit, TaxSplitService, TaxSplitDetailPage } from '.';

@Injectable({ providedIn: 'root' })
export class TaxSplitResolve implements Resolve<TaxSplit> {
  constructor(private service: TaxSplitService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TaxSplit> {
    const id = route.params.id ? route.params.id : null;
    if (id) {
      return this.service.find(id).pipe(
        filter((response: HttpResponse<TaxSplit>) => response.ok),
        map((taxSplit: HttpResponse<TaxSplit>) => taxSplit.body)
      );
    }
    return of(new TaxSplit());
  }
}

const routes: Routes = [
  {
    path: '',
    component: TaxSplitPage,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TaxSplitUpdatePage,
    resolve: {
      data: TaxSplitResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TaxSplitDetailPage,
    resolve: {
      data: TaxSplitResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TaxSplitUpdatePage,
    resolve: {
      data: TaxSplitResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  declarations: [TaxSplitPage, TaxSplitUpdatePage, TaxSplitDetailPage],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, TranslateModule, RouterModule.forChild(routes)],
})
export class TaxSplitPageModule {}
