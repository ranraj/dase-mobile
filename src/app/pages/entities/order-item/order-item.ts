import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { OrderItem } from './order-item.model';
import { OrderItemService } from './order-item.service';

@Component({
  selector: 'page-order-item',
  templateUrl: 'order-item.html',
})
export class OrderItemPage {
  orderItems: OrderItem[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private orderItemService: OrderItemService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.orderItems = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.orderItemService
      .query()
      .pipe(
        filter((res: HttpResponse<OrderItem[]>) => res.ok),
        map((res: HttpResponse<OrderItem[]>) => res.body)
      )
      .subscribe(
        (response: OrderItem[]) => {
          this.orderItems = response;
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

  trackId(index: number, item: OrderItem) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/order-item/new');
  }

  async edit(item: IonItemSliding, orderItem: OrderItem) {
    await this.navController.navigateForward('/tabs/entities/order-item/' + orderItem.id + '/edit');
    await item.close();
  }

  async delete(orderItem) {
    this.orderItemService.delete(orderItem.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'OrderItem deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(orderItem: OrderItem) {
    await this.navController.navigateForward('/tabs/entities/order-item/' + orderItem.id + '/view');
  }
}
