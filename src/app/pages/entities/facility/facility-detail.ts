import { Component, OnInit } from '@angular/core';
import { Facility } from './facility.model';
import { FacilityService } from './facility.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-facility-detail',
  templateUrl: 'facility-detail.html',
})
export class FacilityDetailPage implements OnInit {
  facility: Facility = {};

  constructor(
    private navController: NavController,
    private facilityService: FacilityService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.facility = response.data;
    });
  }

  open(item: Facility) {
    this.navController.navigateForward('/tabs/entities/facility/' + item.id + '/edit');
  }

  async deleteModal(item: Facility) {
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
            this.facilityService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/facility');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
