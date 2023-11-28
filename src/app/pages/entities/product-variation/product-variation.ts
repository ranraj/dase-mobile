import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProductVariation } from './product-variation.model';
import { ProductVariationService } from './product-variation.service';

@Component({
  selector: 'page-product-variation',
  templateUrl: 'product-variation.html',
})
export class ProductVariationPage {
  productVariations: ProductVariation[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productVariationService: ProductVariationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.productVariations = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productVariationService
      .query()
      .pipe(
        filter((res: HttpResponse<ProductVariation[]>) => res.ok),
        map((res: HttpResponse<ProductVariation[]>) => res.body)
      )
      .subscribe(
        (response: ProductVariation[]) => {
          this.productVariations = response;
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

  trackId(index: number, item: ProductVariation) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product-variation/new');
  }

  async edit(item: IonItemSliding, productVariation: ProductVariation) {
    await this.navController.navigateForward('/tabs/entities/product-variation/' + productVariation.id + '/edit');
    await item.close();
  }

  async delete(productVariation) {
    this.productVariationService.delete(productVariation.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ProductVariation deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(productVariation: ProductVariation) {
    await this.navController.navigateForward('/tabs/entities/product-variation/' + productVariation.id + '/view');
  }
}
