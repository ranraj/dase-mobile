import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AssetMaintenance } from './asset-maintenance.model';
import { AssetMaintenanceService } from './asset-maintenance.service';

@Component({
  selector: 'page-asset-maintenance-update',
  templateUrl: 'asset-maintenance-update.html',
})
export class AssetMaintenanceUpdatePage implements OnInit {
  assetMaintenance: AssetMaintenance;
  nextServiceDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    serviceRunningTime: [null, []],
    serviceRunningTimeMeasurement: [null, []],
    restIntervalTime: [null, []],
    restIntervalTimeMeasurement: [null, []],
    nextServiceDate: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private assetMaintenanceService: AssetMaintenanceService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.assetMaintenance = response.data;
      this.isNew = this.assetMaintenance.id === null || this.assetMaintenance.id === undefined;
      this.updateForm(this.assetMaintenance);
    });
  }

  updateForm(assetMaintenance: AssetMaintenance) {
    this.form.patchValue({
      id: assetMaintenance.id,
      serviceRunningTime: assetMaintenance.serviceRunningTime,
      serviceRunningTimeMeasurement: assetMaintenance.serviceRunningTimeMeasurement,
      restIntervalTime: assetMaintenance.restIntervalTime,
      restIntervalTimeMeasurement: assetMaintenance.restIntervalTimeMeasurement,
      nextServiceDate: this.isNew ? new Date().toISOString() : assetMaintenance.nextServiceDate,
    });
  }

  save() {
    this.isSaving = true;
    const assetMaintenance = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.assetMaintenanceService.update(assetMaintenance));
    } else {
      this.subscribeToSaveResponse(this.assetMaintenanceService.create(assetMaintenance));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `AssetMaintenance ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/asset-maintenance');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<AssetMaintenance>>) {
    result.subscribe(
      (res: HttpResponse<AssetMaintenance>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): AssetMaintenance {
    return {
      ...new AssetMaintenance(),
      id: this.form.get(['id']).value,
      serviceRunningTime: this.form.get(['serviceRunningTime']).value,
      serviceRunningTimeMeasurement: this.form.get(['serviceRunningTimeMeasurement']).value,
      restIntervalTime: this.form.get(['restIntervalTime']).value,
      restIntervalTimeMeasurement: this.form.get(['restIntervalTimeMeasurement']).value,
      nextServiceDate: new Date(this.form.get(['nextServiceDate']).value),
    };
  }
}
