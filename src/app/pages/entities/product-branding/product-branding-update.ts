import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductBranding } from './product-branding.model';
import { ProductBrandingService } from './product-branding.service';
import { Company, CompanyService } from '../company';
import { Product, ProductService } from '../product';

@Component({
  selector: 'page-product-branding-update',
  templateUrl: 'product-branding-update.html',
})
export class ProductBrandingUpdatePage implements OnInit {
  productBranding: ProductBranding;
  companies: Company[];
  products: Product[];
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
    company: [null, []],
    product: [null, []],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private companyService: CompanyService,
    private productService: ProductService,
    private productBrandingService: ProductBrandingService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.companyService.query({ filter: 'productbranding-is-null' }).subscribe(
      data => {
        if (!this.productBranding.company || !this.productBranding.company.id) {
          this.companies = data.body;
        } else {
          this.companyService.find(this.productBranding.company.id).subscribe(
            (subData: HttpResponse<Company>) => {
              this.companies = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.productService.query().subscribe(
      data => {
        this.products = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.productBranding = response.data;
      this.isNew = this.productBranding.id === null || this.productBranding.id === undefined;
      this.updateForm(this.productBranding);
    });
  }

  updateForm(productBranding: ProductBranding) {
    this.form.patchValue({
      id: productBranding.id,
      name: productBranding.name,
      description: productBranding.description,
      price: productBranding.price,
      imageSrc: productBranding.imageSrc,
      measurement: productBranding.measurement,
      measurementUnit: productBranding.measurementUnit,
      discountAmount: productBranding.discountAmount,
      discountPercentage: productBranding.discountPercentage,
      company: productBranding.company,
      product: productBranding.product,
    });
  }

  save() {
    this.isSaving = true;
    const productBranding = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.productBrandingService.update(productBranding));
    } else {
      this.subscribeToSaveResponse(this.productBrandingService.create(productBranding));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `ProductBranding ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/product-branding');
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

  compareCompany(first: Company, second: Company): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCompanyById(index: number, item: Company) {
    return item.id;
  }
  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ProductBranding>>) {
    result.subscribe(
      (res: HttpResponse<ProductBranding>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): ProductBranding {
    return {
      ...new ProductBranding(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      description: this.form.get(['description']).value,
      price: this.form.get(['price']).value,
      imageSrc: this.form.get(['imageSrc']).value,
      measurement: this.form.get(['measurement']).value,
      measurementUnit: this.form.get(['measurementUnit']).value,
      discountAmount: this.form.get(['discountAmount']).value,
      discountPercentage: this.form.get(['discountPercentage']).value,
      company: this.form.get(['company']).value,
      product: this.form.get(['product']).value,
    };
  }
}
