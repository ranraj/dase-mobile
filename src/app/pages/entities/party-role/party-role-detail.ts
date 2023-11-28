import { Component, OnInit } from '@angular/core';
import { PartyRole } from './party-role.model';
import { PartyRoleService } from './party-role.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-party-role-detail',
  templateUrl: 'party-role-detail.html',
})
export class PartyRoleDetailPage implements OnInit {
  partyRole: PartyRole = {};

  constructor(
    private navController: NavController,
    private partyRoleService: PartyRoleService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.partyRole = response.data;
    });
  }

  open(item: PartyRole) {
    this.navController.navigateForward('/tabs/entities/party-role/' + item.id + '/edit');
  }

  async deleteModal(item: PartyRole) {
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
            this.partyRoleService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/party-role');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
