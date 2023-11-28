import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AssetServiceHistory } from './asset-service-history.model';
import { AssetServiceHistoryService } from './asset-service-history.service';
import { Party, PartyService } from '../party';

@Component({
  selector: 'page-asset-service-history-update',
  templateUrl: 'asset-service-history-update.html',
})
export class AssetServiceHistoryUpdatePage implements OnInit {
  assetServiceHistory: AssetServiceHistory;
  parties: Party[];
  serviceDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    serviceDate: [null, [Validators.required]],
    isPaid: ['false', []],
    serviceAmount: [null, []],
    vendor: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private partyService: PartyService,
    private assetServiceHistoryService: AssetServiceHistoryService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.partyService.query({ filter: 'assetservicehistory-is-null' }).subscribe(
      data => {
        if (!this.assetServiceHistory.vendor || !this.assetServiceHistory.vendor.id) {
          this.parties = data.body;
        } else {
          this.partyService.find(this.assetServiceHistory.vendor.id).subscribe(
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
      this.assetServiceHistory = response.data;
      this.isNew = this.assetServiceHistory.id === null || this.assetServiceHistory.id === undefined;
      this.updateForm(this.assetServiceHistory);
    });
  }

  updateForm(assetServiceHistory: AssetServiceHistory) {
    this.form.patchValue({
      id: assetServiceHistory.id,
      serviceDate: this.isNew ? new Date().toISOString() : assetServiceHistory.serviceDate,
      isPaid: assetServiceHistory.isPaid,
      serviceAmount: assetServiceHistory.serviceAmount,
      vendor: assetServiceHistory.vendor,
    });
  }

  save() {
    this.isSaving = true;
    const assetServiceHistory = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.assetServiceHistoryService.update(assetServiceHistory));
    } else {
      this.subscribeToSaveResponse(this.assetServiceHistoryService.create(assetServiceHistory));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({
      message: `AssetServiceHistory ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/asset-service-history');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<AssetServiceHistory>>) {
    result.subscribe(
      (res: HttpResponse<AssetServiceHistory>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): AssetServiceHistory {
    return {
      ...new AssetServiceHistory(),
      id: this.form.get(['id']).value,
      serviceDate: new Date(this.form.get(['serviceDate']).value),
      isPaid: this.form.get(['isPaid']).value,
      serviceAmount: this.form.get(['serviceAmount']).value,
      vendor: this.form.get(['vendor']).value,
    };
  }
}
