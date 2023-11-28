import { Component, OnInit } from '@angular/core';
import { AssetServiceHistory } from './asset-service-history.model';
import { AssetServiceHistoryService } from './asset-service-history.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-asset-service-history-detail',
  templateUrl: 'asset-service-history-detail.html',
})
export class AssetServiceHistoryDetailPage implements OnInit {
  assetServiceHistory: AssetServiceHistory = {};

  constructor(
    private navController: NavController,
    private assetServiceHistoryService: AssetServiceHistoryService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.assetServiceHistory = response.data;
    });
  }

  open(item: AssetServiceHistory) {
    this.navController.navigateForward('/tabs/entities/asset-service-history/' + item.id + '/edit');
  }

  async deleteModal(item: AssetServiceHistory) {
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
            this.assetServiceHistoryService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/asset-service-history');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
