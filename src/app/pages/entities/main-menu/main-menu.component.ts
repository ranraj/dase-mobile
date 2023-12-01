import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {

  entities: Array<any[]> = [
    [
      { name: 'Storage', component: 'StorageComponent', route: 'storage', icon: "file-tray-full-outline" },
      { name: 'Party', component: 'PartyPage', route: 'entities/party', icon: "" }
    ],
    [
      { name: 'Organisation', component: 'OrganisationPage', route: 'entities/organisation' },
      { name: 'Company', component: 'CompanyPage', route: 'entities/company', icon: "" }
    ],
    [
      { name: 'Address', component: 'AddressPage', route: 'entities/address', icon: "" },
      { name: 'Facility', component: 'FacilityPage', route: 'entities/facility', icon: "" }
    ],
    [
      { name: 'Asset', component: 'AssetPage', route: 'entities/asset', icon: "" },
      { name: 'Order', component: 'OrderPage', route: 'entities/order', icon: "" }
    ],
    [
      { name: 'Product', component: 'ProductPage', route: 'entities/product', icon: "" },
      { name: 'Catalog', component: 'CatalogPage', route: 'entities/catalog', icon: "" }
    ],
    [
      { name: 'Tax', component: 'TaxPage', route: 'entities/tax', icon: "" }
    ],
    /* jhipster-needle-add-entity-page - JHipster will add entity pages here */
  ];

  constructor(public navController: NavController) { }

  openPage(page) {
    this.navController.navigateForward('/tabs/' + page.route);
  }
}
