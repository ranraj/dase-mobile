import { Component, OnInit } from '@angular/core';
import { PartyType } from './party-type.model';
import { PartyTypeService } from './party-type.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-party-type-detail',
  templateUrl: 'party-type-detail.html',
})
export class PartyTypeDetailPage implements OnInit {
  partyType: PartyType = {};

  constructor(
    private navController: NavController,
    private partyTypeService: PartyTypeService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.partyType = response.data;
    });
  }

  open(item: PartyType) {
    this.navController.navigateForward('/tabs/entities/party-type/' + item.id + '/edit');
  }

  async deleteModal(item: PartyType) {
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
            this.partyTypeService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/party-type');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
