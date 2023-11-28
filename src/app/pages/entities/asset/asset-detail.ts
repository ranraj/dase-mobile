import { Component, OnInit } from '@angular/core';
import { Asset } from './asset.model';
import { AssetService } from './asset.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-asset-detail',
  templateUrl: 'asset-detail.html',
})
export class AssetDetailPage implements OnInit {
  asset: Asset = {};

  constructor(
    private navController: NavController,
    private assetService: AssetService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.asset = response.data;
    });
  }

  open(item: Asset) {
    this.navController.navigateForward('/tabs/entities/asset/' + item.id + '/edit');
  }

  async deleteModal(item: Asset) {
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
            this.assetService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/asset');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
