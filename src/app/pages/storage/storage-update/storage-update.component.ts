import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AlertController, NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { AssetItemType, AssetItemTypeService } from '../../entities/asset-item-type';
import { AssetItem, AssetItemService } from '../../entities/asset-item';
import { Asset, AssetService } from '../../entities/asset';
import { Barcode, BarcodeScanner, LensFacing } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'jhi-storage-update',
  templateUrl: './storage-update.component.html',
  styleUrls: ['./storage-update.component.scss'],
})
export class StorageUpdateComponent implements OnInit {
  asset?: Asset;
  assetItem: AssetItem;
  assetItemTypes: AssetItemType[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;
  autocomplete: { input: string; };

  // Barcode scanner
  isSupported = false;
  barcodes: Barcode[] = [];
  showInstall = false;

  form = this.formBuilder.group({
    id: [null, []],
    assetName: [null, []],
    name: [null, [Validators.required]],
    assetItemCapacity: [null, []],
    weight: [null, []],
    assetItemType: [null, []],
  });

  public formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back),
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private assetItemTypeService: AssetItemTypeService,
    private assetItemService: AssetItemService,
    private assetService: AssetService,
    private alertController: AlertController
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
    this.autocomplete = { input: "" };
  }

  public toggleInstallButton() {
    this.showInstall = !this.showInstall;
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes = barcodes;
    if (barcodes && barcodes.length > 0) {
      this.autocomplete.input = barcodes[0].rawValue;
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }
  public async installGoogleBarcodeScannerModule(): Promise<void> {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }

  updateSearchResults() {
    this.assetService.searchQuery({ "query": this.autocomplete.input }).subscribe(
      data => {
        if (data.body && data.body.length > 0) {
          this.asset = data.body[0];
        }
        console.log(data.body);
        this.fetchRelations();
      },

      error => this.onError(error)
    );
  }

  fetchRelations() {
    this.assetItemService.find(this.asset?.assetItem.id).subscribe(
      data => {
        this.assetItem = data.body;
        console.log(data.body);
        this.updateForm();
      },
      error => this.onError(error)
    );

  }

  createAssetItem(): AssetItem {
    return {
      id: null,
      name: null,
      assetItemCapacity: null,
      weight: null,
      assetItemType: null
    }
  }

  ngOnInit() {
    if (this.assetItem) {
      this.assetItem = this.createAssetItem();
    }
    this.assetItemTypeService.query().subscribe(
      data => {
        this.assetItemTypes = data.body;
      },
      error => this.onError(error)
    );

    this.activatedRoute.data.subscribe(response => {
      this.assetItem = response.data;
      this.isNew = this.assetItem === undefined || this.assetItem.id === null || this.assetItem.id === undefined;
      if (this.assetItem) {
        this.updateForm();
      }
    });
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
  }

  updateForm() {
    this.form.patchValue({
      id: this.assetItem?.id,
      assetName: this.asset?.name,
      name: this.assetItem.name,
      assetItemCapacity: this.assetItem.assetItemCapacity,
      weight: this.assetItem.weight,
      assetItemType: this.assetItem.assetItemType,
    });
  }

  save() {
    this.isSaving = true;
    const assetItem = this.createFromForm();
    if (this.assetItem?.id !== null || this.assetItem?.id !== undefined) {
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
    await this.navController.navigateBack('/tabs/storage');
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
// private static readonly NOT_SORTABLE_FIELDS_AFTER_SEARCH = ['name', 'description', 'image', 'measurement', 'measurementUnit'];

// assets?: Asset[];
// asset?: Asset;
// assetItem?: AssetItem;
// isLoading = false;
// isSaving = false;
// currentAsset?: Asset;
// predicate = 'id';
// ascending = true;
// currentSearch = '';
// emptyAsset?: Asset;
// emptyAssetItem?: AssetItem;
// editForm = this.fb.group({
//   id: [],
//   name: [this.asset?.name, [Validators.required]],
//   assetItemCapacity: [],
//   weight: [],
//   assetItemType: [],
// });

// assetItemType?: AssetItemType;

// page = 1;
// assetItemCapacityValues = Object.keys(AssetItemCapacity);
// assetItemTypesSharedCollection: AssetItemType[] = [];
// assetItemTypeId = 0;

// constructor(
//   private productService: ProductService,
//   protected fb: FormBuilder,
//   protected activatedRoute: ActivatedRoute,
//   public router: Router,
//   protected assetService: AssetService,
//   protected assetItemService: AssetItemService,
//   protected assetItemTypeService: AssetItemTypeService
// ) { }

// ngOnInit(): void {
// this.activatedRoute.data.subscribe(response => {
//   this.assetItem = response.data;
// });
// if (this.assetItem) {
//   this.updateForm(this.assetItem);
// }
// this.loadRelationshipsOptions();
// }

// search(query: string): void {
//   if (query && StorageUpdateComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(this.predicate)) {
//     this.predicate = 'id';
//     this.ascending = true;
//   }
//   this.page = 1;
//   this.currentSearch = query;
//   this.navigateToWithComponentValues();
//   this.load();
// }

// load(): void {
//   //Load AssetItem
// }

// navigateToWithComponentValues(): void {
//   this.handleNavigation(this.predicate, this.ascending, this.currentSearch);
// }

// previousState(): void {
//   window.history.back();
// }

// save(): void {
//   this.isSaving = true;
//   const assetItem = this.createFromForm();
//   if (assetItem.id !== undefined) {
//     this.subscribeToSaveResponse(this.assetItemService.update(assetItem));
//   } else {
//     this.subscribeToSaveResponse(this.assetItemService.create(assetItem));
//   }
// }

// trackAssetItemTypeById(_index: number, item: AssetItemType): number {
//   return item.id!;
// }

// // protected loadFromBackendWithRouteInformations(): Observable<HttpResponse<AssetItem>> {
// //   return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
// //     tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
// //     switchMap(() => this.queryBackend(this.predicate, this.ascending, this.currentSearch))
// //   );
// // }

// protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
//   if (params.has('search') && params.get('search') !== '') {
//     this.currentSearch = params.get('search') as string;
//     if (StorageUpdateComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(this.predicate)) {
//       this.predicate = '';
//     }
//   }
// }

// protected onResponseSuccess(response: HttpResponse<AssetItem>): void {
//   const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
//   this.assets = dataFromBody;
//   if (this.assets.length > 0) {
//     this.asset = this.assets[0];
//     this.loadAssetItemFromBackend(this.asset.assetItem?.id);
//   }
//   if (this.assetItem) {
//     this.updateForm(this.assetItem);
//   }
// }

// protected loadAssetItemFromBackend(id: number | null | undefined): void {
//   if (id === null || id === undefined) {
//     return;
//   }
//   this.assetItemService.find(id).subscribe({
//     next: (res: HttpResponse<AssetItem>) => {
//       if (res.body) {
//         this.assetItem = this.fillComponentAttributesFromResponseBodyAssetItem(res.body);
//         this.assetItemType = this.assetItem.assetItemType;
//       }
//     },
//     error: (err: Error) => {
//       this.assetItem = this.emptyAssetItem;
//     },
//   });
// }

// protected fillComponentAttributesFromResponseBody(data: Asset[] | null): Asset[] {
//   return data ?? [];
// }
// // protected fillComponentAttributesFromResponseBodyAssetItem(assetItem: AssetItem): AssetItem {
// //   this.assetItemTypesSharedCollection = this.assetItemTypeService.addAssetItemTypeToCollectionIfMissing(
// //     this.assetItemTypesSharedCollection,
// //     assetItem.assetItemType
// //   );

// //   this.assetItemType = assetItem.assetItemType;
// //   return assetItem;
// // }

// protected queryBackend(predicate?: string, ascending?: boolean, currentSearch?: string): Observable<HttpResponse<Asset[]>> {
//   this.isLoading = true;
//   const queryObject: any = {
//     eagerload: true,
//     query: currentSearch,
//   };
//   // if (this.currentSearch && this.currentSearch !== '') {
//   //   return this.assetService.search(queryObject).pipe(tap(() => (this.isLoading = false)));
//   // } else {
//   return this.assetService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
//   // }
// }

// protected handleNavigation(predicate?: string, ascending?: boolean, currentSearch?: string): void {
//   const queryParamsObj = {
//     search: currentSearch
//   };

//   this.router.navigate(['./'], {
//     relativeTo: this.activatedRoute,
//     queryParams: queryParamsObj,
//   });
// }

// protected loadRelationshipsOptions(): void {
//   this.assetItemTypeService
//     .query()
//     .pipe(map((res: HttpResponse<AssetItemType[]>) => res.body ?? []))
//     .pipe(
//       map((assetItemTypes: AssetItemType[]) =>
//         this.assetItemTypeService.addAssetItemTypeToCollectionIfMissing(assetItemTypes, this.assetItem?.assetItemType)
//       )
//     )
//     .subscribe((assetItemTypes: AssetItemType[]) => (this.assetItemTypesSharedCollection = assetItemTypes));
// }

// protected subscribeToSaveResponse(result: Observable<HttpResponse<AssetItem>>): void {
//   result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
//     next: () => this.onSaveSuccess(),
//     error: () => this.onSaveError(),
//   });
// }

// protected onSaveSuccess(): void {
//   this.router.navigate(['/storage']);
// }
// protected onSaveError(): void {
//   // Api for inheritance.
// }

// protected onSaveFinalize(): void {
//   this.isSaving = false;
// }

// protected updateForm(assetItem: AssetItem): void {
//   this.editForm.patchValue({
//     id: assetItem.id,
//     name: assetItem.name,
//     assetItemCapacity: assetItem.assetItemCapacity,
//     weight: assetItem.weight,
//     assetItemType: assetItem.assetItemType,
//   });
//   this.assetItemTypesSharedCollection = this.assetItemTypeService.addAssetItemTypeToCollectionIfMissing(
//     this.assetItemTypesSharedCollection,
//     assetItem.assetItemType
//   );
// }

// protected createFromForm(): AssetItem {
//   return {
//     ...new AssetItem(),
//     id: this.editForm.get(['id'])!.value,
//     name: this.editForm.get(['name'])!.value,
//     assetItemCapacity: this.editForm.get(['assetItemCapacity'])!.value,
//     weight: this.editForm.get(['weight'])!.value,
//     assetItemType: this.editForm.get(['assetItemType'])!.value,
//   };
// }
//}
