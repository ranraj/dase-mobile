import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Tax } from './tax.model';
import { TaxService } from './tax.service';

@Component({
  selector: 'page-tax-update',
  templateUrl: 'tax-update.html',
})
export class TaxUpdatePage implements OnInit {
  tax: Tax;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, []],
    percentage: [null, []],
    taxationAuthority: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private taxService: TaxService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.tax = response.data;
      this.isNew = this.tax.id === null || this.tax.id === undefined;
      this.updateForm(this.tax);
    });
  }

  updateForm(tax: Tax) {
    this.form.patchValue({
      id: tax.id,
      name: tax.name,
      percentage: tax.percentage,
      taxationAuthority: tax.taxationAuthority,
    });
  }

  save() {
    this.isSaving = true;
    const tax = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.taxService.update(tax));
    } else {
      this.subscribeToSaveResponse(this.taxService.create(tax));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Tax ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/tax');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Tax>>) {
    result.subscribe(
      (res: HttpResponse<Tax>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Tax {
    return {
      ...new Tax(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      percentage: this.form.get(['percentage']).value,
      taxationAuthority: this.form.get(['taxationAuthority']).value,
    };
  }
}
