import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Party } from './party.model';
import { PartyService } from './party.service';

@Component({
  selector: 'page-party',
  templateUrl: 'party.html',
})
export class PartyPage {
  parties: Party[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private partyService: PartyService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.parties = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.partyService
      .query()
      .pipe(
        filter((res: HttpResponse<Party[]>) => res.ok),
        map((res: HttpResponse<Party[]>) => res.body)
      )
      .subscribe(
        (response: Party[]) => {
          this.parties = response;
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

  trackId(index: number, item: Party) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/party/new');
  }

  async edit(item: IonItemSliding, party: Party) {
    await this.navController.navigateForward('/tabs/entities/party/' + party.id + '/edit');
    await item.close();
  }

  async delete(party) {
    this.partyService.delete(party.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Party deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(party: Party) {
    await this.navController.navigateForward('/tabs/entities/party/' + party.id + '/view');
  }
}
