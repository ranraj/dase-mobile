import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Facility } from './facility.model';
import { FacilityService } from './facility.service';

@Component({
  selector: 'page-facility',
  templateUrl: 'facility.html',
})
export class FacilityPage {
  facilities: Facility[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private facilityService: FacilityService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.facilities = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.facilityService
      .query()
      .pipe(
        filter((res: HttpResponse<Facility[]>) => res.ok),
        map((res: HttpResponse<Facility[]>) => res.body)
      )
      .subscribe(
        (response: Facility[]) => {
          this.facilities = response;
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

  trackId(index: number, item: Facility) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/facility/new');
  }

  async edit(item: IonItemSliding, facility: Facility) {
    await this.navController.navigateForward('/tabs/entities/facility/' + facility.id + '/edit');
    await item.close();
  }

  async delete(facility) {
    this.facilityService.delete(facility.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Facility deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(facility: Facility) {
    await this.navController.navigateForward('/tabs/entities/facility/' + facility.id + '/view');
  }
}
