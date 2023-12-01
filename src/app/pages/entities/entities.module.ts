import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserRouteAccessService } from 'src/app/services/auth/user-route-access.service';
import { EntitiesPage } from './entities.page';
import { MainMenuComponent } from './main-menu/main-menu.component';

const routes: Routes = [
  {
    path: '',
    component: MainMenuComponent,
    data: {
      authorities: ['ROLE_USER'],
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'party',
    loadChildren: () => import('./party/party.module').then(m => m.PartyPageModule),
  },
  {
    path: 'party-type',
    loadChildren: () => import('./party-type/party-type.module').then(m => m.PartyTypePageModule),
  },
  {
    path: 'party-role',
    loadChildren: () => import('./party-role/party-role.module').then(m => m.PartyRolePageModule),
  },
  {
    path: 'organisation',
    loadChildren: () => import('./organisation/organisation.module').then(m => m.OrganisationPageModule),
  },
  {
    path: 'company',
    loadChildren: () => import('./company/company.module').then(m => m.CompanyPageModule),
  },
  {
    path: 'address',
    loadChildren: () => import('./address/address.module').then(m => m.AddressPageModule),
  },
  {
    path: 'facility',
    loadChildren: () => import('./facility/facility.module').then(m => m.FacilityPageModule),
  },
  {
    path: 'asset',
    loadChildren: () => import('./asset/asset.module').then(m => m.AssetPageModule),
  },
  {
    path: 'asset-purchase',
    loadChildren: () => import('./asset-purchase/asset-purchase.module').then(m => m.AssetPurchasePageModule),
  },
  {
    path: 'asset-maintenance',
    loadChildren: () => import('./asset-maintenance/asset-maintenance.module').then(m => m.AssetMaintenancePageModule),
  },
  {
    path: 'asset-service-history',
    loadChildren: () => import('./asset-service-history/asset-service-history.module').then(m => m.AssetServiceHistoryPageModule),
  },
  {
    path: 'asset-item',
    loadChildren: () => import('./asset-item/asset-item.module').then(m => m.AssetItemPageModule),
  },
  {
    path: 'asset-item-type',
    loadChildren: () => import('./asset-item-type/asset-item-type.module').then(m => m.AssetItemTypePageModule),
  },
  {
    path: 'asset-category',
    loadChildren: () => import('./asset-category/asset-category.module').then(m => m.AssetCategoryPageModule),
  },
  {
    path: 'order',
    loadChildren: () => import('./order/order.module').then(m => m.OrderPageModule),
  },
  {
    path: 'order-item',
    loadChildren: () => import('./order-item/order-item.module').then(m => m.OrderItemPageModule),
  },
  {
    path: 'product',
    loadChildren: () => import('./product/product.module').then(m => m.ProductPageModule),
  },
  {
    path: 'catalog',
    loadChildren: () => import('./catalog/catalog.module').then(m => m.CatalogPageModule),
  },
  {
    path: 'product-branding',
    loadChildren: () => import('./product-branding/product-branding.module').then(m => m.ProductBrandingPageModule),
  },
  {
    path: 'product-variation',
    loadChildren: () => import('./product-variation/product-variation.module').then(m => m.ProductVariationPageModule),
  },
  {
    path: 'product-variation-branding',
    loadChildren: () =>
      import('./product-variation-branding/product-variation-branding.module').then(m => m.ProductVariationBrandingPageModule),
  },
  {
    path: 'product-attributes',
    loadChildren: () => import('./product-attributes/product-attributes.module').then(m => m.ProductAttributesPageModule),
  },
  {
    path: 'tax',
    loadChildren: () => import('./tax/tax.module').then(m => m.TaxPageModule),
  },
  {
    path: 'tax-split',
    loadChildren: () => import('./tax-split/tax-split.module').then(m => m.TaxSplitPageModule),
  },
  {
    path: 'product-category',
    loadChildren: () => import('./product-category/product-category.module').then(m => m.ProductCategoryPageModule),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

@NgModule({
  imports: [IonicModule, CommonModule, FormsModule, RouterModule.forChild(routes), TranslateModule],
  declarations: [EntitiesPage, MainMenuComponent],
})
export class EntitiesPageModule { }
