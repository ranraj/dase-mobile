import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-entities',
  templateUrl: 'entities.page.html',
  styleUrls: ['entities.page.scss'],
})
export class EntitiesPage {
  entities: Array<any> = [
    { name: 'Storage', component: 'StorageComponent', route: 'storage' },
    { name: 'Party', component: 'PartyPage', route: 'entities/party' },
    { name: 'Party Type', component: 'PartyTypePage', route: 'entities/party-type' },
    { name: 'Party Role', component: 'PartyRolePage', route: 'entities/party-role' },
    { name: 'Organisation', component: 'OrganisationPage', route: 'entities/organisation' },
    { name: 'Company', component: 'CompanyPage', route: 'entities/company' },
    { name: 'Address', component: 'AddressPage', route: 'entities/address' },
    { name: 'Facility', component: 'FacilityPage', route: 'entities/facility' },
    { name: 'Asset', component: 'AssetPage', route: 'entities/asset' },
    { name: 'Asset Purchase', component: 'AssetPurchasePage', route: 'entities/asset-purchase' },
    { name: 'Asset Maintenance', component: 'AssetMaintenancePage', route: 'entities/asset-maintenance' },
    { name: 'Asset Service History', component: 'AssetServiceHistoryPage', route: 'entities/asset-service-history' },
    { name: 'Asset Item', component: 'AssetItemPage', route: 'entities/asset-item' },
    { name: 'Asset Item Type', component: 'AssetItemTypePage', route: 'entities/asset-item-type' },
    { name: 'Asset Category', component: 'AssetCategoryPage', route: 'entities/asset-category' },
    { name: 'Order', component: 'OrderPage', route: 'entities/order' },
    { name: 'Order Item', component: 'OrderItemPage', route: 'entities/order-item' },
    { name: 'Product', component: 'ProductPage', route: 'entities/product' },
    { name: 'Catalog', component: 'CatalogPage', route: 'entities/catalog' },
    { name: 'Product Branding', component: 'ProductBrandingPage', route: 'entities/product-branding' },
    { name: 'Product Variation', component: 'ProductVariationPage', route: 'entities/product-variation' },
    { name: 'Product Variation Branding', component: 'ProductVariationBrandingPage', route: 'entities/product-variation-branding' },
    { name: 'Product Attributes', component: 'ProductAttributesPage', route: 'entities/product-attributes' },
    { name: 'Tax', component: 'TaxPage', route: 'entities/tax' },
    { name: 'Tax Split', component: 'TaxSplitPage', route: 'entities/tax-split' },
    { name: 'Product Category', component: 'ProductCategoryPage', route: 'entities/product-category' },
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) { }

  openPage(page) {
    this.navController.navigateForward('/tabs/' + page.route);
  }
}
