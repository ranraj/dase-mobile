import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AssetItem } from './asset-item.model';
import { AssetItemService } from './asset-item.service';

@Component({
  selector: 'page-asset-item',
  templateUrl: 'asset-item.html',
})
export class AssetItemPage {
  assetItems: AssetItem[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private assetItemService: AssetItemService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.assetItems = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.assetItemService
      .query()
      .pipe(
        filter((res: HttpResponse<AssetItem[]>) => res.ok),
        map((res: HttpResponse<AssetItem[]>) => res.body)
      )
      .subscribe(
        (response: AssetItem[]) => {
          this.assetItems = response;
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

  trackId(index: number, item: AssetItem) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/asset-item/new');
  }

  async edit(item: IonItemSliding, assetItem: AssetItem) {
    await this.navController.navigateForward('/tabs/entities/asset-item/' + assetItem.id + '/edit');
    await item.close();
  }

  async delete(assetItem) {
    this.assetItemService.delete(assetItem.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'AssetItem deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(assetItem: AssetItem) {
    await this.navController.navigateForward('/tabs/entities/asset-item/' + assetItem.id + '/view');
  }
}
