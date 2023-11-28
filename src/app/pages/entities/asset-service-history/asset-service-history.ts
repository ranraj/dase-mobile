import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AssetServiceHistory } from './asset-service-history.model';
import { AssetServiceHistoryService } from './asset-service-history.service';

@Component({
  selector: 'page-asset-service-history',
  templateUrl: 'asset-service-history.html',
})
export class AssetServiceHistoryPage {
  assetServiceHistories: AssetServiceHistory[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private assetServiceHistoryService: AssetServiceHistoryService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.assetServiceHistories = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.assetServiceHistoryService
      .query()
      .pipe(
        filter((res: HttpResponse<AssetServiceHistory[]>) => res.ok),
        map((res: HttpResponse<AssetServiceHistory[]>) => res.body)
      )
      .subscribe(
        (response: AssetServiceHistory[]) => {
          this.assetServiceHistories = response;
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

  trackId(index: number, item: AssetServiceHistory) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/asset-service-history/new');
  }

  async edit(item: IonItemSliding, assetServiceHistory: AssetServiceHistory) {
    await this.navController.navigateForward('/tabs/entities/asset-service-history/' + assetServiceHistory.id + '/edit');
    await item.close();
  }

  async delete(assetServiceHistory) {
    this.assetServiceHistoryService.delete(assetServiceHistory.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'AssetServiceHistory deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(assetServiceHistory: AssetServiceHistory) {
    await this.navController.navigateForward('/tabs/entities/asset-service-history/' + assetServiceHistory.id + '/view');
  }
}
