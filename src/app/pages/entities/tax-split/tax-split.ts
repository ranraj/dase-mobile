import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { TaxSplit } from './tax-split.model';
import { TaxSplitService } from './tax-split.service';

@Component({
  selector: 'page-tax-split',
  templateUrl: 'tax-split.html',
})
export class TaxSplitPage {
  taxSplits: TaxSplit[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private taxSplitService: TaxSplitService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.taxSplits = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.taxSplitService
      .query()
      .pipe(
        filter((res: HttpResponse<TaxSplit[]>) => res.ok),
        map((res: HttpResponse<TaxSplit[]>) => res.body)
      )
      .subscribe(
        (response: TaxSplit[]) => {
          this.taxSplits = response;
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

  trackId(index: number, item: TaxSplit) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/tax-split/new');
  }

  async edit(item: IonItemSliding, taxSplit: TaxSplit) {
    await this.navController.navigateForward('/tabs/entities/tax-split/' + taxSplit.id + '/edit');
    await item.close();
  }

  async delete(taxSplit) {
    this.taxSplitService.delete(taxSplit.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'TaxSplit deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(taxSplit: TaxSplit) {
    await this.navController.navigateForward('/tabs/entities/tax-split/' + taxSplit.id + '/view');
  }
}
