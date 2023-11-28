import { Component, OnInit } from '@angular/core';
import { ProductBranding } from './product-branding.model';
import { ProductBrandingService } from './product-branding.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-branding-detail',
  templateUrl: 'product-branding-detail.html',
})
export class ProductBrandingDetailPage implements OnInit {
  productBranding: ProductBranding = {};

  constructor(
    private navController: NavController,
    private productBrandingService: ProductBrandingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.productBranding = response.data;
    });
  }

  open(item: ProductBranding) {
    this.navController.navigateForward('/tabs/entities/product-branding/' + item.id + '/edit');
  }

  async deleteModal(item: ProductBranding) {
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
            this.productBrandingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product-branding');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
