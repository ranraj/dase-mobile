import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AssetCategory } from './asset-category.model';
import { AssetCategoryService } from './asset-category.service';
import { Asset, AssetService } from '../asset';

@Component({
  selector: 'page-asset-category-update',
  templateUrl: 'asset-category-update.html',
})
export class AssetCategoryUpdatePage implements OnInit {
  assetCategory: AssetCategory;
  assets: Asset[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    description: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private assetService: AssetService,
    private assetCategoryService: AssetCategoryService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.assetService.query().subscribe(
      data => {
        this.assets = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.assetCategory = response.data;
      this.isNew = this.assetCategory.id === null || this.assetCategory.id === undefined;
      this.updateForm(this.assetCategory);
    });
  }

  updateForm(assetCategory: AssetCategory) {
    this.form.patchValue({
      id: assetCategory.id,
      name: assetCategory.name,
      description: assetCategory.description,
    });
  }

  save() {
    this.isSaving = true;
    const assetCategory = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.assetCategoryService.update(assetCategory));
    } else {
      this.subscribeToSaveResponse(this.assetCategoryService.create(assetCategory));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `AssetCategory ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/asset-category');
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

  compareAsset(first: Asset, second: Asset): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackAssetById(index: number, item: Asset) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<AssetCategory>>) {
    result.subscribe(
      (res: HttpResponse<AssetCategory>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): AssetCategory {
    return {
      ...new AssetCategory(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
    };
  }
}
