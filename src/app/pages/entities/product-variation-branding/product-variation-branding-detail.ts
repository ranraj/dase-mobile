import { Component, OnInit } from '@angular/core';
import { ProductVariationBranding } from './product-variation-branding.model';
import { ProductVariationBrandingService } from './product-variation-branding.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-variation-branding-detail',
  templateUrl: 'product-variation-branding-detail.html',
})
export class ProductVariationBrandingDetailPage implements OnInit {
  productVariationBranding: ProductVariationBranding = {};

  constructor(
    private navController: NavController,
    private productVariationBrandingService: ProductVariationBrandingService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.productVariationBranding = response.data;
    });
  }

  open(item: ProductVariationBranding) {
    this.navController.navigateForward('/tabs/entities/product-variation-branding/' + item.id + '/edit');
  }

  async deleteModal(item: ProductVariationBranding) {
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
            this.productVariationBrandingService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product-variation-branding');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
