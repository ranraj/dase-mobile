import { Component, OnInit } from '@angular/core';
import { OrderItem } from './order-item.model';
import { OrderItemService } from './order-item.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-order-item-detail',
  templateUrl: 'order-item-detail.html',
})
export class OrderItemDetailPage implements OnInit {
  orderItem: OrderItem = {};

  constructor(
    private navController: NavController,
    private orderItemService: OrderItemService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.orderItem = response.data;
    });
  }

  open(item: OrderItem) {
    this.navController.navigateForward('/tabs/entities/order-item/' + item.id + '/edit');
  }

  async deleteModal(item: OrderItem) {
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
            this.orderItemService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/order-item');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
