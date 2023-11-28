import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AssetPurchase } from './asset-purchase.model';
import { AssetPurchaseService } from './asset-purchase.service';
import { Party, PartyService } from '../party';

@Component({
  selector: 'page-asset-purchase-update',
  templateUrl: 'asset-purchase-update.html',
})
export class AssetPurchaseUpdatePage implements OnInit {
  assetPurchase: AssetPurchase;
  parties: Party[];
  purchaseDate: string;
  paymentDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    purchaseDate: [null, [Validators.required]],
    amount: [null, []],
    paymentDate: [null, [Validators.required]],
    paymentMethod: [null, []],
    paymentReference: [null, []],
    paymentStatus: [null, []],
    vendor: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private partyService: PartyService,
    private assetPurchaseService: AssetPurchaseService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.partyService.query({ filter: 'assetpurchase-is-null' }).subscribe(
      data => {
        if (!this.assetPurchase.vendor || !this.assetPurchase.vendor.id) {
          this.parties = data.body;
        } else {
          this.partyService.find(this.assetPurchase.vendor.id).subscribe(
            (subData: HttpResponse<Party>) => {
              this.parties = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.assetPurchase = response.data;
      this.isNew = this.assetPurchase.id === null || this.assetPurchase.id === undefined;
      this.updateForm(this.assetPurchase);
    });
  }

  updateForm(assetPurchase: AssetPurchase) {
    this.form.patchValue({
      id: assetPurchase.id,
      purchaseDate: this.isNew ? new Date().toISOString() : assetPurchase.purchaseDate,
      amount: assetPurchase.amount,
      paymentDate: this.isNew ? new Date().toISOString() : assetPurchase.paymentDate,
      paymentMethod: assetPurchase.paymentMethod,
      paymentReference: assetPurchase.paymentReference,
      paymentStatus: assetPurchase.paymentStatus,
      vendor: assetPurchase.vendor,
    });
  }

  save() {
    this.isSaving = true;
    const assetPurchase = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.assetPurchaseService.update(assetPurchase));
    } else {
      this.subscribeToSaveResponse(this.assetPurchaseService.create(assetPurchase));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `AssetPurchase ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/asset-purchase');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<AssetPurchase>>) {
    result.subscribe(
      (res: HttpResponse<AssetPurchase>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): AssetPurchase {
    return {
      ...new AssetPurchase(),
      id: this.form.get(['id']).value,
      purchaseDate: new Date(this.form.get(['purchaseDate']).value),
      amount: this.form.get(['amount']).value,
      paymentDate: new Date(this.form.get(['paymentDate']).value),
      paymentMethod: this.form.get(['paymentMethod']).value,
      paymentReference: this.form.get(['paymentReference']).value,
      paymentStatus: this.form.get(['paymentStatus']).value,
      vendor: this.form.get(['vendor']).value,
    };
  }
}
