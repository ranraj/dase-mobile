import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AssetItemType } from './asset-item-type.model';
import { AssetItemTypeService } from './asset-item-type.service';

@Component({
  selector: 'page-asset-item-type',
  templateUrl: 'asset-item-type.html',
})
export class AssetItemTypePage {
  assetItemTypes: AssetItemType[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private assetItemTypeService: AssetItemTypeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.assetItemTypes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.assetItemTypeService
      .query()
      .pipe(
        filter((res: HttpResponse<AssetItemType[]>) => res.ok),
        map((res: HttpResponse<AssetItemType[]>) => res.body)
      )
      .subscribe(
        (response: AssetItemType[]) => {
          this.assetItemTypes = response;
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

  trackId(index: number, item: AssetItemType) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/asset-item-type/new');
  }

  async edit(item: IonItemSliding, assetItemType: AssetItemType) {
    await this.navController.navigateForward('/tabs/entities/asset-item-type/' + assetItemType.id + '/edit');
    await item.close();
  }

  async delete(assetItemType) {
    this.assetItemTypeService.delete(assetItemType.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'AssetItemType deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(assetItemType: AssetItemType) {
    await this.navController.navigateForward('/tabs/entities/asset-item-type/' + assetItemType.id + '/view');
  }
}
