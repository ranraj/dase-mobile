import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { PartyRole } from './party-role.model';
import { PartyRoleService } from './party-role.service';

@Component({
  selector: 'page-party-role',
  templateUrl: 'party-role.html',
})
export class PartyRolePage {
  partyRoles: PartyRole[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private partyRoleService: PartyRoleService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.partyRoles = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.partyRoleService
      .query()
      .pipe(
        filter((res: HttpResponse<PartyRole[]>) => res.ok),
        map((res: HttpResponse<PartyRole[]>) => res.body)
      )
      .subscribe(
        (response: PartyRole[]) => {
          this.partyRoles = response;
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

  trackId(index: number, item: PartyRole) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/party-role/new');
  }

  async edit(item: IonItemSliding, partyRole: PartyRole) {
    await this.navController.navigateForward('/tabs/entities/party-role/' + partyRole.id + '/edit');
    await item.close();
  }

  async delete(partyRole) {
    this.partyRoleService.delete(partyRole.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'PartyRole deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(partyRole: PartyRole) {
    await this.navController.navigateForward('/tabs/entities/party-role/' + partyRole.id + '/view');
  }
}
