import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Organisation } from './organisation.model';
import { OrganisationService } from './organisation.service';

@Component({
  selector: 'page-organisation',
  templateUrl: 'organisation.html',
})
export class OrganisationPage {
  organisations: Organisation[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private organisationService: OrganisationService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.organisations = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.organisationService
      .query()
      .pipe(
        filter((res: HttpResponse<Organisation[]>) => res.ok),
        map((res: HttpResponse<Organisation[]>) => res.body)
      )
      .subscribe(
        (response: Organisation[]) => {
          this.organisations = response;
          if (typeof refresher !== 'undefined') {
            setTimeout(() => {
              refresher.target.complete();
            }, 750);
          }
        },
        async error => {
          console.error(error);
          const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
          await toast.present();
        }
      );
  }

  trackId(index: number, item: Organisation) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/organisation/new');
  }

  async edit(item: IonItemSliding, organisation: Organisation) {
    await this.navController.navigateForward('/tabs/entities/organisation/' + organisation.id + '/edit');
    await item.close();
  }

  async delete(organisation) {
    this.organisationService.delete(organisation.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Organisation deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(organisation: Organisation) {
    await this.navController.navigateForward('/tabs/entities/organisation/' + organisation.id + '/view');
  }
}
