import { Component, OnInit } from '@angular/core';
import { Address } from './address.model';
import { AddressService } from './address.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-address-detail',
  templateUrl: 'address-detail.html',
})
export class AddressDetailPage implements OnInit {
  address: Address = {};

  constructor(
    private navController: NavController,
    private addressService: AddressService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.address = response.data;
    });
  }

  open(item: Address) {
    this.navController.navigateForward('/tabs/entities/address/' + item.id + '/edit');
  }

  async deleteModal(item: Address) {
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
            this.addressService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/address');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
