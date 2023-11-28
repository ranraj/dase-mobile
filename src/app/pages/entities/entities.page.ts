import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'Party', component: 'PartyPage', route: 'party' },
    { name: 'Party Type', component: 'PartyTypePage', route: 'party-type' },
    { name: 'Party Role', component: 'PartyRolePage', route: 'party-role' },
    { name: 'Organisation', component: 'OrganisationPage', route: 'organisation' },
    { name: 'Company', component: 'CompanyPage', route: 'company' },
    { name: 'Address', component: 'AddressPage', route: 'address' },
    { name: 'Facility', component: 'FacilityPage', route: 'facility' },
    { name: 'Asset', component: 'AssetPage', route: 'asset' },
    { name: 'Asset Purchase', component: 'AssetPurchasePage', route: 'asset-purchase' },
    { name: 'Asset Maintenance', component: 'AssetMaintenancePage', route: 'asset-maintenance' },
    { name: 'Asset Service History', component: 'AssetServiceHistoryPage', route: 'asset-service-history' },
    { name: 'Asset Item', component: 'AssetItemPage', route: 'asset-item' },
    { name: 'Asset Item Type', component: 'AssetItemTypePage', route: 'asset-item-type' },
    { name: 'Asset Category', component: 'AssetCategoryPage', route: 'asset-category' },
    { name: 'Order', component: 'OrderPage', route: 'order' },
    { name: 'Order Item', component: 'OrderItemPage', route: 'order-item' },
    { name: 'Product', component: 'ProductPage', route: 'product' },
    { name: 'Catalog', component: 'CatalogPage', route: 'catalog' },
    { name: 'Product Branding', component: 'ProductBrandingPage', route: 'product-branding' },
    { name: 'Product Variation', component: 'ProductVariationPage', route: 'product-variation' },
    { name: 'Product Variation Branding', component: 'ProductVariationBrandingPage', route: 'product-variation-branding' },
    { name: 'Product Attributes', component: 'ProductAttributesPage', route: 'product-attributes' },
    { name: 'Tax', component: 'TaxPage', route: 'tax' },
    { name: 'Tax Split', component: 'TaxSplitPage', route: 'tax-split' },
    { name: 'Product Category', component: 'ProductCategoryPage', route: 'product-category' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) {}

  openPage(page) {
    this.navController.navigateForward('/tabs/entities/' + page.route);
  }
}
