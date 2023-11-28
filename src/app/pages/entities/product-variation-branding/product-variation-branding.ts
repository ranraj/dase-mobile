import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProductVariationBranding } from './product-variation-branding.model';
import { ProductVariationBrandingService } from './product-variation-branding.service';

@Component({
  selector: 'page-product-variation-branding',
  templateUrl: 'product-variation-branding.html',
})
export class ProductVariationBrandingPage {
  productVariationBrandings: ProductVariationBranding[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productVariationBrandingService: ProductVariationBrandingService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.productVariationBrandings = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productVariationBrandingService
      .query()
      .pipe(
        filter((res: HttpResponse<ProductVariationBranding[]>) => res.ok),
        map((res: HttpResponse<ProductVariationBranding[]>) => res.body)
      )
      .subscribe(
        (response: ProductVariationBranding[]) => {
          this.productVariationBrandings = response;
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

  trackId(index: number, item: ProductVariationBranding) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product-variation-branding/new');
  }

  async edit(item: IonItemSliding, productVariationBranding: ProductVariationBranding) {
    await this.navController.navigateForward('/tabs/entities/product-variation-branding/' + productVariationBranding.id + '/edit');
    await item.close();
  }

  async delete(productVariationBranding) {
    this.productVariationBrandingService.delete(productVariationBranding.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ProductVariationBranding deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(productVariationBranding: ProductVariationBranding) {
    await this.navController.navigateForward('/tabs/entities/product-variation-branding/' + productVariationBranding.id + '/view');
  }
}
