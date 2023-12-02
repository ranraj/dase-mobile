import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Party } from './party.model';
import { PartyService } from './party.service';
import { Company, CompanyService } from '../company';

@Component({
  selector: 'page-party-update',
  templateUrl: 'party-update.html',
})
export class PartyUpdatePage implements OnInit {
  party: Party;
  companies: Company[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    gstNo: [null, [Validators.required]],
    phone: [null, [Validators.required]],
    comments: [null, []],
    primaryType: [null, [Validators.required]],
    company: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private companyService: CompanyService,
    private partyService: PartyService
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
    this.activatedRoute.data.subscribe(response => {
      this.party = response.data;
      this.isNew = this.party.id === null || this.party.id === undefined;
      this.updateForm(this.party);
    });
  }

  updateForm(party: Party) {
    this.form.patchValue({
      id: party.id,
      name: party.name,
      email: party.email,
      gstNo: party.gstNo,
      phone: party.phone,
      comments: party.comments,
      primaryType: party.primaryType,
      company: party.company,
    });
  }

  save() {
    this.isSaving = true;
    const party = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.partyService.update(party));
    } else {
      this.subscribeToSaveResponse(this.partyService.create(party));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Party ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/party');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Party>>) {
    result.subscribe(
      (res: HttpResponse<Party>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Party {
    return {
      ...new Party(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      email: this.form.get(['email']).value,
      gstNo: this.form.get(['gstNo']).value,
      phone: this.form.get(['phone']).value,
      comments: this.form.get(['comments']).value,
      primaryType: this.form.get(['primaryType']).value,
      company: this.form.get(['company']).value,
    };
  }
}
