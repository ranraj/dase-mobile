import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Asset } from './asset.model';
import { AssetService } from './asset.service';

@Component({
  selector: 'page-asset',
  templateUrl: 'asset.html',
})
export class AssetPage {
  assets: Asset[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private assetService: AssetService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.assets = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.assetService
      .query()
      .pipe(
        filter((res: HttpResponse<Asset[]>) => res.ok),
        map((res: HttpResponse<Asset[]>) => res.body)
      )
      .subscribe(
        (response: Asset[]) => {
          this.assets = response;
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

  trackId(index: number, item: Asset) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/asset/new');
  }

  async edit(item: IonItemSliding, asset: Asset) {
    await this.navController.navigateForward('/tabs/entities/asset/' + asset.id + '/edit');
    await item.close();
  }

  async delete(asset) {
    this.assetService.delete(asset.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Asset deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(asset: Asset) {
    await this.navController.navigateForward('/tabs/entities/asset/' + asset.id + '/view');
  }
}
