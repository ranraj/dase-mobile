import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AssetItem } from './asset-item.model';
import { AssetItemService } from './asset-item.service';
import { AssetItemType, AssetItemTypeService } from '../asset-item-type';

@Component({
  selector: 'page-asset-item-update',
  templateUrl: 'asset-item-update.html',
})
export class AssetItemUpdatePage implements OnInit {
  assetItem: AssetItem;
  assetItemTypes: AssetItemType[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    assetItemCapacity: [null, []],
    weight: [null, []],
    assetItemType: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private assetItemTypeService: AssetItemTypeService,
    private assetItemService: AssetItemService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.assetItemTypeService.query().subscribe(
      data => {
        this.assetItemTypes = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.assetItem = response.data;
      this.isNew = this.assetItem.id === null || this.assetItem.id === undefined;
      this.updateForm(this.assetItem);
    });
  }

  updateForm(assetItem: AssetItem) {
    this.form.patchValue({
      id: assetItem.id,
      name: assetItem.name,
      assetItemCapacity: assetItem.assetItemCapacity,
      weight: assetItem.weight,
      assetItemType: assetItem.assetItemType,
    });
  }

  save() {
    this.isSaving = true;
    const assetItem = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.assetItemService.update(assetItem));
    } else {
      this.subscribeToSaveResponse(this.assetItemService.create(assetItem));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `AssetItem ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/asset-item');
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

  compareAssetItemType(first: AssetItemType, second: AssetItemType): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackAssetItemTypeById(index: number, item: AssetItemType) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<AssetItem>>) {
    result.subscribe(
      (res: HttpResponse<AssetItem>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): AssetItem {
    return {
      ...new AssetItem(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      assetItemCapacity: this.form.get(['assetItemCapacity']).value,
      weight: this.form.get(['weight']).value,
      assetItemType: this.form.get(['assetItemType']).value,
    };
  }
}
