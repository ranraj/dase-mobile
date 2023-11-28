import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Facility } from './facility.model';
import { FacilityService } from './facility.service';
import { Company, CompanyService } from '../company';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-facility-update',
  templateUrl: 'facility-update.html',
})
export class FacilityUpdatePage implements OnInit {
  facility: Facility;
  companies: Company[];
  users: User[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    geoLocation: [null, []],
    company: [null, [Validators.required]],
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
    private facilityService: FacilityService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
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
      this.facility = response.data;
      this.isNew = this.facility.id === null || this.facility.id === undefined;
      this.updateForm(this.facility);
    });
  }

  updateForm(facility: Facility) {
    this.form.patchValue({
      id: facility.id,
      name: facility.name,
      geoLocation: facility.geoLocation,
      company: facility.company,
      user: facility.user,
    });
  }

  save() {
    this.isSaving = true;
    const facility = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.facilityService.update(facility));
    } else {
      this.subscribeToSaveResponse(this.facilityService.create(facility));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Facility ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/facility');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Facility>>) {
    result.subscribe(
      (res: HttpResponse<Facility>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Facility {
    return {
      ...new Facility(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      geoLocation: this.form.get(['geoLocation']).value,
      company: this.form.get(['company']).value,
      user: this.form.get(['user']).value,
    };
  }
}
