import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AssetMaintenance } from './asset-maintenance.model';
import { AssetMaintenanceService } from './asset-maintenance.service';

@Component({
  selector: 'page-asset-maintenance',
  templateUrl: 'asset-maintenance.html',
})
export class AssetMaintenancePage {
  assetMaintenances: AssetMaintenance[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private assetMaintenanceService: AssetMaintenanceService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.assetMaintenances = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.assetMaintenanceService
      .query()
      .pipe(
        filter((res: HttpResponse<AssetMaintenance[]>) => res.ok),
        map((res: HttpResponse<AssetMaintenance[]>) => res.body)
      )
      .subscribe(
        (response: AssetMaintenance[]) => {
          this.assetMaintenances = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: AssetMaintenance) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/asset-maintenance/new');
  }

  async edit(item: IonItemSliding, assetMaintenance: AssetMaintenance) {
    await this.navController.navigateForward('/tabs/entities/asset-maintenance/' + assetMaintenance.id + '/edit');
    await item.close();
  }

  async delete(assetMaintenance) {
    this.assetMaintenanceService.delete(assetMaintenance.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'AssetMaintenance deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(assetMaintenance: AssetMaintenance) {
    await this.navController.navigateForward('/tabs/entities/asset-maintenance/' + assetMaintenance.id + '/view');
  }
}
