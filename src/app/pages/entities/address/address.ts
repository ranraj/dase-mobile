import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Address } from './address.model';
import { AddressService } from './address.service';

@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  addresses: Address[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private addressService: AddressService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.addresses = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.addressService
      .query()
      .pipe(
        filter((res: HttpResponse<Address[]>) => res.ok),
        map((res: HttpResponse<Address[]>) => res.body)
      )
      .subscribe(
        (response: Address[]) => {
          this.addresses = response;
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

  trackId(index: number, item: Address) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/address/new');
  }

  async edit(item: IonItemSliding, address: Address) {
    await this.navController.navigateForward('/tabs/entities/address/' + address.id + '/edit');
    await item.close();
  }

  async delete(address) {
    this.addressService.delete(address.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Address deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(address: Address) {
    await this.navController.navigateForward('/tabs/entities/address/' + address.id + '/view');
  }
}
