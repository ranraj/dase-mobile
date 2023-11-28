import { Component, OnInit } from '@angular/core';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage implements OnInit {
  order: Order = {};

  constructor(
    private navController: NavController,
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.order = response.data;
    });
  }

  open(item: Order) {
    this.navController.navigateForward('/tabs/entities/order/' + item.id + '/edit');
  }

  async deleteModal(item: Order) {
    const alert = await this.alertController.create({
      header: 'Confirm the deletion?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Delete',
          handler: () => {
            this.orderService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/order');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
