import { Component, OnInit } from '@angular/core';
import { Party } from './party.model';
import { PartyService } from './party.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-party-detail',
  templateUrl: 'party-detail.html',
})
export class PartyDetailPage implements OnInit {
  party: Party = {};

  constructor(
    private navController: NavController,
    private partyService: PartyService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.party = response.data;
    });
  }

  open(item: Party) {
    this.navController.navigateForward('/tabs/entities/party/' + item.id + '/edit');
  }

  async deleteModal(item: Party) {
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
            this.partyService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/party');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
