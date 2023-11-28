import { Component, OnInit } from '@angular/core';
import { Tax } from './tax.model';
import { TaxService } from './tax.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-tax-detail',
  templateUrl: 'tax-detail.html',
})
export class TaxDetailPage implements OnInit {
  tax: Tax = {};

  constructor(
    private navController: NavController,
    private taxService: TaxService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.tax = response.data;
    });
  }

  open(item: Tax) {
    this.navController.navigateForward('/tabs/entities/tax/' + item.id + '/edit');
  }

  async deleteModal(item: Tax) {
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
            this.taxService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/tax');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
