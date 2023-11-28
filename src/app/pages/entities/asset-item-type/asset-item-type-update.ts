import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AssetItemType } from './asset-item-type.model';
import { AssetItemTypeService } from './asset-item-type.service';

@Component({
  selector: 'page-asset-item-type-update',
  templateUrl: 'asset-item-type-update.html',
})
export class AssetItemTypeUpdatePage implements OnInit {
  assetItemType: AssetItemType;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    code: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private assetItemTypeService: AssetItemTypeService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(response => {
      this.assetItemType = response.data;
      this.isNew = this.assetItemType.id === null || this.assetItemType.id === undefined;
      this.updateForm(this.assetItemType);
    });
  }

  updateForm(assetItemType: AssetItemType) {
    this.form.patchValue({
      id: assetItemType.id,
      name: assetItemType.name,
      code: assetItemType.code,
    });
  }

  save() {
    this.isSaving = true;
    const assetItemType = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.assetItemTypeService.update(assetItemType));
    } else {
      this.subscribeToSaveResponse(this.assetItemTypeService.create(assetItemType));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `AssetItemType ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/asset-item-type');
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<AssetItemType>>) {
    result.subscribe(
      (res: HttpResponse<AssetItemType>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): AssetItemType {
    return {
      ...new AssetItemType(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      code: this.form.get(['code']).value,
    };
  }
}
