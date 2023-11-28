import { Component, OnInit } from '@angular/core';
import { TaxSplit } from './tax-split.model';
import { TaxSplitService } from './tax-split.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-tax-split-detail',
  templateUrl: 'tax-split-detail.html',
})
export class TaxSplitDetailPage implements OnInit {
  taxSplit: TaxSplit = {};

  constructor(
    private navController: NavController,
    private taxSplitService: TaxSplitService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.taxSplit = response.data;
    });
  }

  open(item: TaxSplit) {
    this.navController.navigateForward('/tabs/entities/tax-split/' + item.id + '/edit');
  }

  async deleteModal(item: TaxSplit) {
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
            this.taxSplitService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/tax-split');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
