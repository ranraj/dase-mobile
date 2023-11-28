import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { PartyRole } from './party-role.model';
import { PartyRoleService } from './party-role.service';

@Component({
  selector: 'page-party-role-update',
  templateUrl: 'party-role-update.html',
})
export class PartyRoleUpdatePage implements OnInit {
  partyRole: PartyRole;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, []],
    permission: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private partyRoleService: PartyRoleService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.partyRole = response.data;
      this.isNew = this.partyRole.id === null || this.partyRole.id === undefined;
      this.updateForm(this.partyRole);
    });
  }

  updateForm(partyRole: PartyRole) {
    this.form.patchValue({
      id: partyRole.id,
      name: partyRole.name,
      permission: partyRole.permission,
    });
  }

  save() {
    this.isSaving = true;
    const partyRole = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.partyRoleService.update(partyRole));
    } else {
      this.subscribeToSaveResponse(this.partyRoleService.create(partyRole));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `PartyRole ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/party-role');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<PartyRole>>) {
    result.subscribe(
      (res: HttpResponse<PartyRole>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): PartyRole {
    return {
      ...new PartyRole(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      permission: this.form.get(['permission']).value,
    };
  }
}
