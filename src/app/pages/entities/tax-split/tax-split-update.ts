import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { TaxSplit } from './tax-split.model';
import { TaxSplitService } from './tax-split.service';
import { Tax, TaxService } from '../tax';

@Component({
  selector: 'page-tax-split-update',
  templateUrl: 'tax-split-update.html',
})
export class TaxSplitUpdatePage implements OnInit {
  taxSplit: TaxSplit;
  taxes: Tax[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    percentage: [null, []],
    tax: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private taxService: TaxService,
    private taxSplitService: TaxSplitService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.taxService.query().subscribe(
      data => {
        this.taxes = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.taxSplit = response.data;
      this.isNew = this.taxSplit.id === null || this.taxSplit.id === undefined;
      this.updateForm(this.taxSplit);
    });
  }

  updateForm(taxSplit: TaxSplit) {
    this.form.patchValue({
      id: taxSplit.id,
      name: taxSplit.name,
      percentage: taxSplit.percentage,
      tax: taxSplit.tax,
    });
  }

  save() {
    this.isSaving = true;
    const taxSplit = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.taxSplitService.update(taxSplit));
    } else {
      this.subscribeToSaveResponse(this.taxSplitService.create(taxSplit));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `TaxSplit ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/tax-split');
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

  compareTax(first: Tax, second: Tax): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackTaxById(index: number, item: Tax) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<TaxSplit>>) {
    result.subscribe(
      (res: HttpResponse<TaxSplit>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): TaxSplit {
    return {
      ...new TaxSplit(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      percentage: this.form.get(['percentage']).value,
      tax: this.form.get(['tax']).value,
    };
  }
}
