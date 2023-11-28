import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductVariation } from './product-variation.model';
import { ProductVariationService } from './product-variation.service';
import { Product, ProductService } from '../product';
import { Tax, TaxService } from '../tax';

@Component({
  selector: 'page-product-variation-update',
  templateUrl: 'product-variation-update.html',
})
export class ProductVariationUpdatePage implements OnInit {
  productVariation: ProductVariation;
  products: Product[];
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
    product: [null, []],
    tax: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private productService: ProductService,
    private taxService: TaxService,
    private productVariationService: ProductVariationService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.productService.query().subscribe(
      data => {
        this.products = data.body;
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
      this.productVariation = response.data;
      this.isNew = this.productVariation.id === null || this.productVariation.id === undefined;
      this.updateForm(this.productVariation);
    });
  }

  updateForm(productVariation: ProductVariation) {
    this.form.patchValue({
      id: productVariation.id,
      name: productVariation.name,
      description: productVariation.description,
      price: productVariation.price,
      imageSrc: productVariation.imageSrc,
      measurement: productVariation.measurement,
      measurementUnit: productVariation.measurementUnit,
      discountAmount: productVariation.discountAmount,
      discountPercentage: productVariation.discountPercentage,
      product: productVariation.product,
      tax: productVariation.tax,
    });
  }

  save() {
    this.isSaving = true;
    const productVariation = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productVariationService.update(productVariation));
    } else {
      this.subscribeToSaveResponse(this.productVariationService.create(productVariation));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ProductVariation ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product-variation');
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

  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }
  compareTax(first: Tax, second: Tax): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackTaxById(index: number, item: Tax) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductVariation>>) {
    result.subscribe(
      (res: HttpResponse<ProductVariation>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): ProductVariation {
    return {
      ...new ProductVariation(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
      price: this.form.get(['price']).value,
      imageSrc: this.form.get(['imageSrc']).value,
      measurement: this.form.get(['measurement']).value,
      measurementUnit: this.form.get(['measurementUnit']).value,
      discountAmount: this.form.get(['discountAmount']).value,
      discountPercentage: this.form.get(['discountPercentage']).value,
      product: this.form.get(['product']).value,
      tax: this.form.get(['tax']).value,
    };
  }
}
