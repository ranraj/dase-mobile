import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { ProductAttributes } from './product-attributes.model';
import { ProductAttributesService } from './product-attributes.service';

@Component({
  selector: 'page-product-attributes',
  templateUrl: 'product-attributes.html',
})
export class ProductAttributesPage {
  productAttributes: ProductAttributes[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private productAttributesService: ProductAttributesService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.productAttributes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.productAttributesService
      .query()
      .pipe(
        filter((res: HttpResponse<ProductAttributes[]>) => res.ok),
        map((res: HttpResponse<ProductAttributes[]>) => res.body)
      )
      .subscribe(
        (response: ProductAttributes[]) => {
          this.productAttributes = response;
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

  trackId(index: number, item: ProductAttributes) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/product-attributes/new');
  }

  async edit(item: IonItemSliding, productAttributes: ProductAttributes) {
    await this.navController.navigateForward('/tabs/entities/product-attributes/' + productAttributes.id + '/edit');
    await item.close();
  }

  async delete(productAttributes) {
    this.productAttributesService.delete(productAttributes.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({
          message: 'ProductAttributes deleted successfully.',
          duration: 3000,
          position: 'middle',
        });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(productAttributes: ProductAttributes) {
    await this.navController.navigateForward('/tabs/entities/product-attributes/' + productAttributes.id + '/view');
  }
}
