import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { Organisation, OrganisationService } from '../organisation';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-company-update',
  templateUrl: 'company-update.html',
})
export class CompanyUpdatePage implements OnInit {
  company: Company;
  organisations: Organisation[];
  companies: Company[];
  users: User[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    displayName: [null, [Validators.required]],
    email: [null, [Validators.required]],
    gstNo: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    website: [null, []],
    imageSrc: [null, []],
    gstType: [null, []],
    currencyType: [null, []],
    geoLocation: [null, []],
    orgnisation: [null, [Validators.required]],
    parent: [null, []],
    user: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private organisationService: OrganisationService,
    private userService: UserService,
    private companyService: CompanyService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.organisationService.query().subscribe(
      data => {
        this.organisations = data.body;
      },
      error => this.onError(error)
    );
    this.companyService.query().subscribe(
      data => {
        this.companies = data.body;
      },
      error => this.onError(error)
    );
    this.userService.findAll().subscribe(
      data => (this.users = data),
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.company = response.data;
      this.isNew = this.company.id === null || this.company.id === undefined;
      this.updateForm(this.company);
    });
  }

  updateForm(company: Company) {
    this.form.patchValue({
      id: company.id,
      name: company.name,
      displayName: company.displayName,
      email: company.email,
      gstNo: company.gstNo,
      phone: company.phone,
      website: company.website,
      imageSrc: company.imageSrc,
      gstType: company.gstType,
      currencyType: company.currencyType,
      geoLocation: company.geoLocation,
      orgnisation: company.orgnisation,
      parent: company.parent,
      user: company.user,
    });
  }

  save() {
    this.isSaving = true;
    const company = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.companyService.update(company));
    } else {
      this.subscribeToSaveResponse(this.companyService.create(company));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Company ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/company');
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

  compareOrganisation(first: Organisation, second: Organisation): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackOrganisationById(index: number, item: Organisation) {
    return item.id;
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Company>>) {
    result.subscribe(
      (res: HttpResponse<Company>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Company {
    return {
      ...new Company(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      displayName: this.form.get(['displayName']).value,
      email: this.form.get(['email']).value,
      gstNo: this.form.get(['gstNo']).value,
      phone: this.form.get(['phone']).value,
      website: this.form.get(['website']).value,
      imageSrc: this.form.get(['imageSrc']).value,
      gstType: this.form.get(['gstType']).value,
      currencyType: this.form.get(['currencyType']).value,
      geoLocation: this.form.get(['geoLocation']).value,
      orgnisation: this.form.get(['orgnisation']).value,
      parent: this.form.get(['parent']).value,
      user: this.form.get(['user']).value,
    };
  }
}
