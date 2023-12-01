import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'storage',
        children: [
          {
            path: '',
            loadChildren: () => import('../storage/storage.module').then(m => m.StorageModule),
          },
        ],
      },
      {
        path: 'portal',
        children: [
          {
            path: '',
            loadChildren: () => import('../portal/portal.module').then(m => m.PortalModule),
          },
        ],
      },
      {
        path: 'home',
        children: [
          {
            path: '',
            loadChildren: () => import('../home/home.module').then(m => m.HomePageModule),
          },
        ],
      },
      {
        path: 'entities',
        children: [
          {
            path: '',
            loadChildren: () => import('../entities/entities.module').then(m => m.EntitiesPageModule),
          },
        ],
      },
      {
        path: 'account',
        children: [
          {
            path: '',
            loadChildren: () => import('../account/account.module').then(m => m.AccountPageModule),
          },
        ],
      },
      {
        path: '',
        redirectTo: '/tabs/portal',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/portal',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule { }
