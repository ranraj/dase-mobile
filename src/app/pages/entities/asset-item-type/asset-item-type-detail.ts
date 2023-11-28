import { Component, OnInit } from '@angular/core';
import { AssetItemType } from './asset-item-type.model';
import { AssetItemTypeService } from './asset-item-type.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-asset-item-type-detail',
  templateUrl: 'asset-item-type-detail.html',
})
export class AssetItemTypeDetailPage implements OnInit {
  assetItemType: AssetItemType = {};

  constructor(
    private navController: NavController,
    private assetItemTypeService: AssetItemTypeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.assetItemType = response.data;
    });
  }

  open(item: AssetItemType) {
    this.navController.navigateForward('/tabs/entities/asset-item-type/' + item.id + '/edit');
  }

  async deleteModal(item: AssetItemType) {
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
            this.assetItemTypeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/asset-item-type');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
