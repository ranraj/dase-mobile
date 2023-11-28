import { Component, OnInit } from '@angular/core';
import { Organisation } from './organisation.model';
import { OrganisationService } from './organisation.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-organisation-detail',
  templateUrl: 'organisation-detail.html',
})
export class OrganisationDetailPage implements OnInit {
  organisation: Organisation = {};

  constructor(
    private navController: NavController,
    private organisationService: OrganisationService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.organisation = response.data;
    });
  }

  open(item: Organisation) {
    this.navController.navigateForward('/tabs/entities/organisation/' + item.id + '/edit');
  }

  async deleteModal(item: Organisation) {
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
            this.organisationService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/organisation');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
