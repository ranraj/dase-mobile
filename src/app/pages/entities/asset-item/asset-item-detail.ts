import { Component, OnInit } from '@angular/core';
import { AssetItem } from './asset-item.model';
import { AssetItemService } from './asset-item.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-asset-item-detail',
  templateUrl: 'asset-item-detail.html',
})
export class AssetItemDetailPage implements OnInit {
  assetItem: AssetItem = {};

  constructor(
    private navController: NavController,
    private assetItemService: AssetItemService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.assetItem = response.data;
    });
  }

  open(item: AssetItem) {
    this.navController.navigateForward('/tabs/entities/asset-item/' + item.id + '/edit');
  }

  async deleteModal(item: AssetItem) {
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
            this.assetItemService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/asset-item');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
