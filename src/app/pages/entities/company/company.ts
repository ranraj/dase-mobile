import { Component } from '@angular/core';
import { NavController, ToastController, Platform, IonItemSliding } from '@ionic/angular';
import { filter, map } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Company } from './company.model';
import { CompanyService } from './company.service';

@Component({
  selector: 'page-company',
  templateUrl: 'company.html',
})
export class CompanyPage {
  companies: Company[];

  // todo: add pagination

  constructor(
    private navController: NavController,
    private companyService: CompanyService,
    private toastCtrl: ToastController,
    public plt: Platform
  ) {
    this.companies = [];
  }

  async ionViewWillEnter() {
    await this.loadAll();
  }

  async loadAll(refresher?) {
    this.companyService
      .query()
      .pipe(
        filter((res: HttpResponse<Company[]>) => res.ok),
        map((res: HttpResponse<Company[]>) => res.body)
      )
      .subscribe(
        (response: Company[]) => {
          this.companies = response;
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

  trackId(index: number, item: Company) {
    return item.id;
  }

  async new() {
    await this.navController.navigateForward('/tabs/entities/company/new');
  }

  async edit(item: IonItemSliding, company: Company) {
    await this.navController.navigateForward('/tabs/entities/company/' + company.id + '/edit');
    await item.close();
  }

  async delete(company) {
    this.companyService.delete(company.id).subscribe(
      async () => {
        const toast = await this.toastCtrl.create({ message: 'Company deleted successfully.', duration: 3000, position: 'middle' });
        await toast.present();
        await this.loadAll();
      },
      error => console.error(error)
    );
  }

  async view(company: Company) {
    await this.navController.navigateForward('/tabs/entities/company/' + company.id + '/view');
  }
}
