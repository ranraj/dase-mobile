import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Order } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  orders: Order[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private orderService: OrderService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.orders = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.orderService
      .query()
      .pipe(
        filter((res: HttpResponse<Order[]>) => res.ok),
        map((res: HttpResponse<Order[]>) => res.body)
      )
      .subscribe(
        (response: Order[]) => {
          this.orders = response;
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

  trackId(index: number, item: Order) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/order/new');
  }

  async edit(item: IonItemSliding, order: Order) {
    await this.navController.navigateForward('/tabs/entities/order/' + order.id + '/edit');
    await item.close();
  }

  async delete(order) {
    this.orderService.delete(order.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Order deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(order: Order) {
    await this.navController.navigateForward('/tabs/entities/order/' + order.id + '/view');
  }
}
