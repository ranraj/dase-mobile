import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Tax } from './tax.model';
import { TaxService } from './tax.service';

@Component({
  selector: 'page-tax',
  templateUrl: 'tax.html',
})
export class TaxPage {
  taxes: Tax[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private taxService: TaxService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.taxes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.taxService
      .query()
      .pipe(
        filter((res: HttpResponse<Tax[]>) => res.ok),
        map((res: HttpResponse<Tax[]>) => res.body)
      )
      .subscribe(
        (response: Tax[]) => {
          this.taxes = response;
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

  trackId(index: number, item: Tax) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/tax/new');
  }

  async edit(item: IonItemSliding, tax: Tax) {
    await this.navController.navigateForward('/tabs/entities/tax/' + tax.id + '/edit');
    await item.close();
  }

  async delete(tax) {
    this.taxService.delete(tax.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Tax deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(tax: Tax) {
    await this.navController.navigateForward('/tabs/entities/tax/' + tax.id + '/view');
  }
}
