import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Catalog } from './catalog.model';
import { CatalogService } from './catalog.service';

@Component({
  selector: 'page-catalog',
  templateUrl: 'catalog.html',
})
export class CatalogPage {
  catalogs: Catalog[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private catalogService: CatalogService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.catalogs = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.catalogService
      .query()
      .pipe(
        filter((res: HttpResponse<Catalog[]>) => res.ok),
        map((res: HttpResponse<Catalog[]>) => res.body)
      )
      .subscribe(
        (response: Catalog[]) => {
          this.catalogs = response;
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

  trackId(index: number, item: Catalog) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/catalog/new');
  }

  async edit(item: IonItemSliding, catalog: Catalog) {
    await this.navController.navigateForward('/tabs/entities/catalog/' + catalog.id + '/edit');
    await item.close();
  }

  async delete(catalog) {
    this.catalogService.delete(catalog.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Catalog deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(catalog: Catalog) {
    await this.navController.navigateForward('/tabs/entities/catalog/' + catalog.id + '/view');
  }
}
