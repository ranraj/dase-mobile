import { Component, OnInit } from '@angular/core';
import { AssetPurchase } from './asset-purchase.model';
import { AssetPurchaseService } from './asset-purchase.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-asset-purchase-detail',
  templateUrl: 'asset-purchase-detail.html',
})
export class AssetPurchaseDetailPage implements OnInit {
  assetPurchase: AssetPurchase = {};

  constructor(
    private navController: NavController,
    private assetPurchaseService: AssetPurchaseService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.assetPurchase = response.data;
    });
  }

  open(item: AssetPurchase) {
    this.navController.navigateForward('/tabs/entities/asset-purchase/' + item.id + '/edit');
  }

  async deleteModal(item: AssetPurchase) {
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
            this.assetPurchaseService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/asset-purchase');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
