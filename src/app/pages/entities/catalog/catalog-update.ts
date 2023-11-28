import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Catalog } from './catalog.model';
import { CatalogService } from './catalog.service';
import { Company, CompanyService } from '../company';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-catalog-update',
  templateUrl: 'catalog-update.html',
})
export class CatalogUpdatePage implements OnInit {
  catalog: Catalog;
  companies: Company[];
  users: User[];
  activeOn: string;
  createdDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    active: ['false', []],
    activeOn: [null, []],
    createdDate: [null, []],
    company: [null, []],
    user: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private companyService: CompanyService,
    private userService: UserService,
    private catalogService: CatalogService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.companyService.query({ filter: 'catalog-is-null' }).subscribe(
      data => {
        if (!this.catalog.company || !this.catalog.company.id) {
          this.companies = data.body;
        } else {
          this.companyService.find(this.catalog.company.id).subscribe(
            (subData: HttpResponse<Company>) => {
              this.companies = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.userService.findAll().subscribe(
      data => (this.users = data),
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.catalog = response.data;
      this.isNew = this.catalog.id === null || this.catalog.id === undefined;
      this.updateForm(this.catalog);
    });
  }

  updateForm(catalog: Catalog) {
    this.form.patchValue({
      id: catalog.id,
      name: catalog.name,
      active: catalog.active,
      activeOn: this.isNew ? new Date().toISOString() : catalog.activeOn,
      createdDate: this.isNew ? new Date().toISOString() : catalog.createdDate,
      company: catalog.company,
      user: catalog.user,
    });
  }

  save() {
    this.isSaving = true;
    const catalog = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.catalogService.update(catalog));
    } else {
      this.subscribeToSaveResponse(this.catalogService.create(catalog));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Catalog ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/catalog');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  compareCompany(first: Company, second: Company): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCompanyById(index: number, item: Company) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Catalog>>) {
    result.subscribe(
      (res: HttpResponse<Catalog>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Catalog {
    return {
      ...new Catalog(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      active: this.form.get(['active']).value,
      activeOn: new Date(this.form.get(['activeOn']).value),
      createdDate: new Date(this.form.get(['createdDate']).value),
      company: this.form.get(['company']).value,
      user: this.form.get(['user']).value,
    };
  }
}
