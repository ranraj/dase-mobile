import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Asset } from './asset.model';
import { AssetService } from './asset.service';
import { AssetItem, AssetItemService } from '../asset-item';
import { AssetMaintenance, AssetMaintenanceService } from '../asset-maintenance';
import { AssetPurchase, AssetPurchaseService } from '../asset-purchase';
import { Facility, FacilityService } from '../facility';
import { AssetCategory, AssetCategoryService } from '../asset-category';

@Component({
  selector: 'page-asset-update',
  templateUrl: 'asset-update.html',
})
export class AssetUpdatePage implements OnInit {
  asset: Asset;
  assetItems: AssetItem[];
  assetMaintenances: AssetMaintenance[];
  assetPurchases: AssetPurchase[];
  facilities: Facility[];
  assetCategories: AssetCategory[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, [Validators.required]],
    assetType: [null, []],
    assetOwnership: [null, []],
    isEmpty: ['false', []],
    maxCapacity: [null, []],
    maxCapacityMeasurement: [null, []],
    maxRunningTime: [null, []],
    maxRunningTimeMeasurement: [null, []],
    assetItem: [null, []],
    maintenance: [null, []],
    purchase: [null, []],
    facility: [null, [Validators.required]],
    assetCategories: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private assetItemService: AssetItemService,
    private assetMaintenanceService: AssetMaintenanceService,
    private assetPurchaseService: AssetPurchaseService,
    private facilityService: FacilityService,
    private assetCategoryService: AssetCategoryService,
    private assetService: AssetService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.assetItemService.query({ filter: 'asset-is-null' }).subscribe(
      data => {
        if (!this.asset.assetItem || !this.asset.assetItem.id) {
          this.assetItems = data.body;
        } else {
          this.assetItemService.find(this.asset.assetItem.id).subscribe(
            (subData: HttpResponse<AssetItem>) => {
              this.assetItems = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.assetMaintenanceService.query({ filter: 'asset-is-null' }).subscribe(
      data => {
        if (!this.asset.maintenance || !this.asset.maintenance.id) {
          this.assetMaintenances = data.body;
        } else {
          this.assetMaintenanceService.find(this.asset.maintenance.id).subscribe(
            (subData: HttpResponse<AssetMaintenance>) => {
              this.assetMaintenances = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.assetPurchaseService.query({ filter: 'asset-is-null' }).subscribe(
      data => {
        if (!this.asset.purchase || !this.asset.purchase.id) {
          this.assetPurchases = data.body;
        } else {
          this.assetPurchaseService.find(this.asset.purchase.id).subscribe(
            (subData: HttpResponse<AssetPurchase>) => {
              this.assetPurchases = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.facilityService.query().subscribe(
      data => {
        this.facilities = data.body;
      },
      error => this.onError(error)
    );
    this.assetCategoryService.query().subscribe(
      data => {
        this.assetCategories = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.asset = response.data;
      this.isNew = this.asset.id === null || this.asset.id === undefined;
      this.updateForm(this.asset);
    });
  }

  updateForm(asset: Asset) {
    this.form.patchValue({
      id: asset.id,
      name: asset.name,
      code: asset.code,
      assetType: asset.assetType,
      assetOwnership: asset.assetOwnership,
      isEmpty: asset.isEmpty,
      maxCapacity: asset.maxCapacity,
      maxCapacityMeasurement: asset.maxCapacityMeasurement,
      maxRunningTime: asset.maxRunningTime,
      maxRunningTimeMeasurement: asset.maxRunningTimeMeasurement,
      assetItem: asset.assetItem,
      maintenance: asset.maintenance,
      purchase: asset.purchase,
      facility: asset.facility,
      assetCategories: asset.assetCategories,
    });
  }

  save() {
    this.isSaving = true;
    const asset = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.assetService.update(asset));
    } else {
      this.subscribeToSaveResponse(this.assetService.create(asset));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Asset ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/asset');
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

  compareAssetItem(first: AssetItem, second: AssetItem): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackAssetItemById(index: number, item: AssetItem) {
    return item.id;
  }
  compareAssetMaintenance(first: AssetMaintenance, second: AssetMaintenance): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackAssetMaintenanceById(index: number, item: AssetMaintenance) {
    return item.id;
  }
  compareAssetPurchase(first: AssetPurchase, second: AssetPurchase): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackAssetPurchaseById(index: number, item: AssetPurchase) {
    return item.id;
  }
  compareFacility(first: Facility, second: Facility): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackFacilityById(index: number, item: Facility) {
    return item.id;
  }
  compareAssetCategory(first: AssetCategory, second: AssetCategory): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackAssetCategoryById(index: number, item: AssetCategory) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Asset>>) {
    result.subscribe(
      (res: HttpResponse<Asset>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Asset {
    return {
      ...new Asset(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      code: this.form.get(['code']).value,
      assetType: this.form.get(['assetType']).value,
      assetOwnership: this.form.get(['assetOwnership']).value,
      isEmpty: this.form.get(['isEmpty']).value,
      maxCapacity: this.form.get(['maxCapacity']).value,
      maxCapacityMeasurement: this.form.get(['maxCapacityMeasurement']).value,
      maxRunningTime: this.form.get(['maxRunningTime']).value,
      maxRunningTimeMeasurement: this.form.get(['maxRunningTimeMeasurement']).value,
      assetItem: this.form.get(['assetItem']).value,
      maintenance: this.form.get(['maintenance']).value,
      purchase: this.form.get(['purchase']).value,
      facility: this.form.get(['facility']).value,
      assetCategories: this.form.get(['assetCategories']).value,
    };
  }
}
