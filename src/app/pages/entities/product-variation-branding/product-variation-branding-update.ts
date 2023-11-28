import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductVariationBranding } from './product-variation-branding.model';
import { ProductVariationBrandingService } from './product-variation-branding.service';
import { ProductVariation, ProductVariationService } from '../product-variation';
import { Tax, TaxService } from '../tax';

@Component({
  selector: 'page-product-variation-branding-update',
  templateUrl: 'product-variation-branding-update.html',
})
export class ProductVariationBrandingUpdatePage implements OnInit {
  productVariationBranding: ProductVariationBranding;
  productVariations: ProductVariation[];
  taxes: Tax[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    description: [null, []],
    price: [null, [Validators.required]],
    imageSrc: [null, []],
    measurement: [null, []],
    measurementUnit: [null, []],
    discountAmount: [null, []],
    discountPercentage: [null, []],
    productVariation: [null, []],
    tax: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private productVariationService: ProductVariationService,
    private taxService: TaxService,
    private productVariationBrandingService: ProductVariationBrandingService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.productVariationService.query().subscribe(
      data => {
        this.productVariations = data.body;
      },
      error => this.onError(error)
    );
    this.taxService.query().subscribe(
      data => {
        this.taxes = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.productVariationBranding = response.data;
      this.isNew = this.productVariationBranding.id === null || this.productVariationBranding.id === undefined;
      this.updateForm(this.productVariationBranding);
    });
  }

  updateForm(productVariationBranding: ProductVariationBranding) {
    this.form.patchValue({
      id: productVariationBranding.id,
      name: productVariationBranding.name,
      description: productVariationBranding.description,
      price: productVariationBranding.price,
      imageSrc: productVariationBranding.imageSrc,
      measurement: productVariationBranding.measurement,
      measurementUnit: productVariationBranding.measurementUnit,
      discountAmount: productVariationBranding.discountAmount,
      discountPercentage: productVariationBranding.discountPercentage,
      productVariation: productVariationBranding.productVariation,
      tax: productVariationBranding.tax,
    });
  }

  save() {
    this.isSaving = true;
    const productVariationBranding = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productVariationBrandingService.update(productVariationBranding));
    } else {
      this.subscribeToSaveResponse(this.productVariationBrandingService.create(productVariationBranding));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({
      message: `ProductVariationBranding ${action} successfully.`,
      duration: 2000,
      position: 'middle',
    });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product-variation-branding');
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

  compareProductVariation(first: ProductVariation, second: ProductVariation): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductVariationById(index: number, item: ProductVariation) {
    return item.id;
  }
  compareTax(first: Tax, second: Tax): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackTaxById(index: number, item: Tax) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductVariationBranding>>) {
    result.subscribe(
      (res: HttpResponse<ProductVariationBranding>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): ProductVariationBranding {
    return {
      ...new ProductVariationBranding(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
      price: this.form.get(['price']).value,
      imageSrc: this.form.get(['imageSrc']).value,
      measurement: this.form.get(['measurement']).value,
      measurementUnit: this.form.get(['measurementUnit']).value,
      discountAmount: this.form.get(['discountAmount']).value,
      discountPercentage: this.form.get(['discountPercentage']).value,
      productVariation: this.form.get(['productVariation']).value,
      tax: this.form.get(['tax']).value,
    };
  }
}
