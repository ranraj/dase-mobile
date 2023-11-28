import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProductBranding } from './product-branding.model';
import { ProductBrandingService } from './product-branding.service';

@Component({
  selector: 'page-product-branding',
  templateUrl: 'product-branding.html',
})
export class ProductBrandingPage {
  productBrandings: ProductBranding[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productBrandingService: ProductBrandingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.productBrandings = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productBrandingService
      .query()
      .pipe(
        filter((res: HttpResponse<ProductBranding[]>) => res.ok),
        map((res: HttpResponse<ProductBranding[]>) => res.body)
      )
      .subscribe(
        (response: ProductBranding[]) => {
          this.productBrandings = response;
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

  trackId(index: number, item: ProductBranding) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product-branding/new');
  }

  async edit(item: IonItemSliding, productBranding: ProductBranding) {
    await this.navController.navigateForward('/tabs/entities/product-branding/' + productBranding.id + '/edit');
    await item.close();
  }

  async delete(productBranding) {
    this.productBrandingService.delete(productBranding.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'ProductBranding deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(productBranding: ProductBranding) {
    await this.navController.navigateForward('/tabs/entities/product-branding/' + productBranding.id + '/view');
  }
}
