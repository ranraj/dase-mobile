import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AssetPurchase } from './asset-purchase.model';
import { AssetPurchaseService } from './asset-purchase.service';

@Component({
  selector: 'page-asset-purchase',
  templateUrl: 'asset-purchase.html',
})
export class AssetPurchasePage {
  assetPurchases: AssetPurchase[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private assetPurchaseService: AssetPurchaseService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.assetPurchases = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.assetPurchaseService
      .query()
      .pipe(
        filter((res: HttpResponse<AssetPurchase[]>) => res.ok),
        map((res: HttpResponse<AssetPurchase[]>) => res.body)
      )
      .subscribe(
        (response: AssetPurchase[]) => {
          this.assetPurchases = response;
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

  trackId(index: number, item: AssetPurchase) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/asset-purchase/new');
  }

  async edit(item: IonItemSliding, assetPurchase: AssetPurchase) {
    await this.navController.navigateForward('/tabs/entities/asset-purchase/' + assetPurchase.id + '/edit');
    await item.close();
  }

  async delete(assetPurchase) {
    this.assetPurchaseService.delete(assetPurchase.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'AssetPurchase deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(assetPurchase: AssetPurchase) {
    await this.navController.navigateForward('/tabs/entities/asset-purchase/' + assetPurchase.id + '/view');
  }
}
