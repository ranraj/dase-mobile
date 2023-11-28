import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PartyType } from './party-type.model';
import { PartyTypeService } from './party-type.service';

@Component({
  selector: 'page-party-type-update',
  templateUrl: 'party-type-update.html',
})
export class PartyTypeUpdatePage implements OnInit {
  partyType: PartyType;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, []],
    comment: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private partyTypeService: PartyTypeService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.partyType = response.data;
      this.isNew = this.partyType.id === null || this.partyType.id === undefined;
      this.updateForm(this.partyType);
    });
  }

  updateForm(partyType: PartyType) {
    this.form.patchValue({
      id: partyType.id,
      name: partyType.name,
      comment: partyType.comment,
    });
  }

  save() {
    this.isSaving = true;
    const partyType = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.partyTypeService.update(partyType));
    } else {
      this.subscribeToSaveResponse(this.partyTypeService.create(partyType));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `PartyType ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/party-type');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PartyType>>) {
    result.subscribe(
      (res: HttpResponse<PartyType>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): PartyType {
    return {
      ...new PartyType(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      comment: this.form.get(['comment']).value,
    };
  }
}
