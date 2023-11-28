import { Component, OnInit } from '@angular/core';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'page-company-detail',
  templateUrl: 'company-detail.html',
})
export class CompanyDetailPage implements OnInit {
  company: Company = {};

  constructor(
    private navController: NavController,
    private companyService: CompanyService,
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(response => {
      this.company = response.data;
    });
  }

  open(item: Company) {
    this.navController.navigateForward('/tabs/entities/company/' + item.id + '/edit');
  }

  async deleteModal(item: Company) {
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
            this.companyService.delete(item.id).subscribe(() => {
              this.navController.navigateForward('/tabs/entities/company');
            });
          },
        },
      ],
    });
    await alert.present();
  }
}
