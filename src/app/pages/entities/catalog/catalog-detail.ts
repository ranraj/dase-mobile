import { Component, OnInit } from '@angular/core';
import { Catalog } from './catalog.model';
import { CatalogService } from './catalog.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-catalog-detail',
  templateUrl: 'catalog-detail.html',
})
export class CatalogDetailPage implements OnInit {
  catalog: Catalog = {};

  constructor(
    private navController: NavController,
    private catalogService: CatalogService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.catalog = response.data;
    });
  }

  open(item: Catalog) {
    this.navController.navigateForward('/tabs/entities/catalog/' + item.id + '/edit');
  }

  async deleteModal(item: Catalog) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.catalogService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/catalog');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
