import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Address } from './address.model';
import { AddressService } from './address.service';
import { Party, PartyService } from '../party';
import { Company, CompanyService } from '../company';
import { Facility, FacilityService } from '../facility';

@Component({
  selector: 'page-address-update',
  templateUrl: 'address-update.html',
})
export class AddressUpdatePage implements OnInit {
  address: Address;
  parties: Party[];
  companies: Company[];
  facilities: Facility[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    addressLine1: [null, [Validators.required]],
    addressLine2: [null, []],
    localState: [null, [Validators.required]],
    city: [null, [Validators.required]],
    country: [null, [Validators.required]],
    postalCode: [null, [Validators.required]],
    addressType: [null, []],
    party: [null, []],
    company: [null, []],
    facility: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private partyService: PartyService,
    private companyService: CompanyService,
    private facilityService: FacilityService,
    private addressService: AddressService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.partyService.query().subscribe(
      data => {
        this.parties = data.body;
      },
      error => this.onError(error)
    );
    this.companyService.query().subscribe(
      data => {
        this.companies = data.body;
      },
      error => this.onError(error)
    );
    this.facilityService.query().subscribe(
      data => {
        this.facilities = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.address = response.data;
      this.isNew = this.address.id === null || this.address.id === undefined;
      this.updateForm(this.address);
    });
  }

  updateForm(address: Address) {
    this.form.patchValue({
      id: address.id,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      localState: address.localState,
      city: address.city,
      country: address.country,
      postalCode: address.postalCode,
      addressType: address.addressType,
      party: address.party,
      company: address.company,
      facility: address.facility,
    });
  }

  save() {
    this.isSaving = true;
    const address = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.addressService.update(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.create(address));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Address ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/address');
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

  compareParty(first: Party, second: Party): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPartyById(index: number, item: Party) {
    return item.id;
  }
  compareCompany(first: Company, second: Company): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCompanyById(index: number, item: Company) {
    return item.id;
  }
  compareFacility(first: Facility, second: Facility): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFacilityById(index: number, item: Facility) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Address>>) {
    result.subscribe(
      (res: HttpResponse<Address>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Address {
    return {
      ...new Address(),
      id: this.form.get(['id']).value,
      addressLine1: this.form.get(['addressLine1']).value,
      addressLine2: this.form.get(['addressLine2']).value,
      localState: this.form.get(['localState']).value,
      city: this.form.get(['city']).value,
      country: this.form.get(['country']).value,
      postalCode: this.form.get(['postalCode']).value,
      addressType: this.form.get(['addressType']).value,
      party: this.form.get(['party']).value,
      company: this.form.get(['company']).value,
      facility: this.form.get(['facility']).value,
    };
  }
}
