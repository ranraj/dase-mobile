import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { PartyType } from './party-type.model';
import { PartyTypeService } from './party-type.service';

@Component({
  selector: 'page-party-type',
  templateUrl: 'party-type.html',
})
export class PartyTypePage {
  partyTypes: PartyType[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private partyTypeService: PartyTypeService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.partyTypes = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.partyTypeService
      .query()
      .pipe(
        filter((res: HttpResponse<PartyType[]>) => res.ok),
        map((res: HttpResponse<PartyType[]>) => res.body)
      )
      .subscribe(
        (response: PartyType[]) => {
          this.partyTypes = response;
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

  trackId(index: number, item: PartyType) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/party-type/new');
  }

  async edit(item: IonItemSliding, partyType: PartyType) {
    await this.navController.navigateForward('/tabs/entities/party-type/' + partyType.id + '/edit');
    await item.close();
  }

  async delete(partyType) {
    this.partyTypeService.delete(partyType.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'PartyType deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(partyType: PartyType) {
    await this.navController.navigateForward('/tabs/entities/party-type/' + partyType.id + '/view');
  }
}
