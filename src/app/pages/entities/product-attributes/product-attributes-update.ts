import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductAttributes } from './product-attributes.model';
import { ProductAttributesService } from './product-attributes.service';
import { Product, ProductService } from '../product';
import { ProductBranding, ProductBrandingService } from '../product-branding';
import { ProductVariation, ProductVariationService } from '../product-variation';
import { ProductVariationBranding, ProductVariationBrandingService } from '../product-variation-branding';

@Component({
  selector: 'page-product-attributes-update',
  templateUrl: 'product-attributes-update.html',
})
export class ProductAttributesUpdatePage implements OnInit {
  productAttributes: ProductAttributes;
  products: Product[];
  productBrandings: ProductBranding[];
  productVariations: ProductVariation[];
  productVariationBrandings: ProductVariationBranding[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    value: [null, [Validators.required]],
    comments: [null, []],
    hidden: ['false', []],
    internal: ['false', []],
    product: [null, []],
    productBranding: [null, []],
    productVariation: [null, []],
    productVariationBranding: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private productService: ProductService,
    private productBrandingService: ProductBrandingService,
    private productVariationService: ProductVariationService,
    private productVariationBrandingService: ProductVariationBrandingService,
    private productAttributesService: ProductAttributesService
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
    this.productBrandingService.query().subscribe(
      data => {
        this.productBrandings = data.body;
      },
      error => this.onError(error)
    );
    this.productVariationService.query().subscribe(
      data => {
        this.productVariations = data.body;
      },
      error => this.onError(error)
    );
    this.productVariationBrandingService.query().subscribe(
      data => {
        this.productVariationBrandings = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.productAttributes = response.data;
      this.isNew = this.productAttributes.id === null || this.productAttributes.id === undefined;
      this.updateForm(this.productAttributes);
    });
  }

  updateForm(productAttributes: ProductAttributes) {
    this.form.patchValue({
      id: productAttributes.id,
      name: productAttributes.name,
      value: productAttributes.value,
      comments: productAttributes.comments,
      hidden: productAttributes.hidden,
      internal: productAttributes.internal,
      product: productAttributes.product,
      productBranding: productAttributes.productBranding,
      productVariation: productAttributes.productVariation,
      productVariationBranding: productAttributes.productVariationBranding,
    });
  }

  save() {
    this.isSaving = true;
    const productAttributes = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productAttributesService.update(productAttributes));
    } else {
      this.subscribeToSaveResponse(this.productAttributesService.create(productAttributes));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ProductAttributes ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product-attributes');
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
  compareProductBranding(first: ProductBranding, second: ProductBranding): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductBrandingById(index: number, item: ProductBranding) {
    return item.id;
  }
  compareProductVariation(first: ProductVariation, second: ProductVariation): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductVariationById(index: number, item: ProductVariation) {
    return item.id;
  }
  compareProductVariationBranding(first: ProductVariationBranding, second: ProductVariationBranding): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductVariationBrandingById(index: number, item: ProductVariationBranding) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductAttributes>>) {
    result.subscribe(
      (res: HttpResponse<ProductAttributes>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): ProductAttributes {
    return {
      ...new ProductAttributes(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      value: this.form.get(['value']).value,
      comments: this.form.get(['comments']).value,
      hidden: this.form.get(['hidden']).value,
      internal: this.form.get(['internal']).value,
      product: this.form.get(['product']).value,
      productBranding: this.form.get(['productBranding']).value,
      productVariation: this.form.get(['productVariation']).value,
      productVariationBranding: this.form.get(['productVariationBranding']).value,
    };
  }
}
