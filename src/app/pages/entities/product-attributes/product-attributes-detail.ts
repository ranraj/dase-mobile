import { Component, OnInit } from '@angular/core';
import { ProductAttributes } from './product-attributes.model';
import { ProductAttributesService } from './product-attributes.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-product-attributes-detail',
  templateUrl: 'product-attributes-detail.html',
})
export class ProductAttributesDetailPage implements OnInit {
  productAttributes: ProductAttributes = {};

  constructor(
    private navController: NavController,
    private productAttributesService: ProductAttributesService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.productAttributes = response.data;
    });
  }

  open(item: ProductAttributes) {
    this.navController.navigateForward('/tabs/entities/product-attributes/' + item.id + '/edit');
  }

  async deleteModal(item: ProductAttributes) {
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
            this.productAttributesService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/product-attributes');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
