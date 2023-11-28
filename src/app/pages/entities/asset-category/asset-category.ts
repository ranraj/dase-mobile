import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { AssetCategory } from './asset-category.model';
import { AssetCategoryService } from './asset-category.service';

@Component({
  selector: 'page-asset-category',
  templateUrl: 'asset-category.html',
})
export class AssetCategoryPage {
  assetCategories: AssetCategory[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private assetCategoryService: AssetCategoryService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.assetCategories = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.assetCategoryService
      .query()
      .pipe(
        filter((res: HttpResponse<AssetCategory[]>) => res.ok),
        map((res: HttpResponse<AssetCategory[]>) => res.body)
      )
      .subscribe(
        (response: AssetCategory[]) => {
          this.assetCategories = response;
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

  trackId(index: number, item: AssetCategory) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/asset-category/new');
  }

  async edit(item: IonItemSliding, assetCategory: AssetCategory) {
    await this.navController.navigateForward('/tabs/entities/asset-category/' + assetCategory.id + '/edit');
    await item.close();
  }

  async delete(assetCategory) {
    this.assetCategoryService.delete(assetCategory.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'AssetCategory deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(assetCategory: AssetCategory) {
    await this.navController.navigateForward('/tabs/entities/asset-category/' + assetCategory.id + '/view');
  }
}
