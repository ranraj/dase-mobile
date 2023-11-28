import { Component, OnInit } from '@angular/core';
import { ProductVariation } from './product-variation.model';
import { ProductVariationService } from './product-variation.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-variation-detail',
  templateUrl: 'product-variation-detail.html',
})
export class ProductVariationDetailPage implements OnInit {
  productVariation: ProductVariation = {};

  constructor(
    private navController: NavController,
    private productVariationService: ProductVariationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.productVariation = response.data;
    });
  }

  open(item: ProductVariation) {
    this.navController.navigateForward('/tabs/entities/product-variation/' + item.id + '/edit');
  }

  async deleteModal(item: ProductVariation) {
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
            this.productVariationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product-variation');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
