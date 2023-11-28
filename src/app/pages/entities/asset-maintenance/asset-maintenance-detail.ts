import { Component, OnInit } from '@angular/core';
import { AssetMaintenance } from './asset-maintenance.model';
import { AssetMaintenanceService } from './asset-maintenance.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-asset-maintenance-detail',
  templateUrl: 'asset-maintenance-detail.html',
})
export class AssetMaintenanceDetailPage implements OnInit {
  assetMaintenance: AssetMaintenance = {};

  constructor(
    private navController: NavController,
    private assetMaintenanceService: AssetMaintenanceService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.assetMaintenance = response.data;
    });
  }

  open(item: AssetMaintenance) {
    this.navController.navigateForward('/tabs/entities/asset-maintenance/' + item.id + '/edit');
  }

  async deleteModal(item: AssetMaintenance) {
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
            this.assetMaintenanceService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/asset-maintenance');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
