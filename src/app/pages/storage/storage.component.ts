import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

import { ProductService } from '../entities/product/product.service';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, finalize, map, Observable, switchMap, tap } from 'rxjs';
import { AssetService } from '../entities/asset/asset.service';
import { AssetItem, AssetItemCapacity } from '../entities/asset-item/asset-item.model';
import { AssetItemService } from '../entities/asset-item/asset-item.service';
import { HttpResponse } from '@angular/common/http';
import { AssetItemType } from '../entities/asset-item-type/asset-item-type.model';
import { AssetItemTypeService } from '../entities/asset-item-type/asset-item-type.service';
import { Asset } from '../entities/asset';

@Component({
  selector: 'jhi-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss'],
})
export class StorageComponent implements OnInit {
  private static readonly NOT_SORTABLE_FIELDS_AFTER_SEARCH = ['name', 'description', 'image', 'measurement', 'measurementUnit'];

  assets?: Asset[];
  asset?: Asset;
  assetItem?: AssetItem;
  isLoading = false;
  isSaving = false;
  currentAsset?: Asset;
  predicate = 'id';
  ascending = true;
  currentSearch = '';
  emptyAsset?: Asset;
  emptyAssetItem?: AssetItem;
  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    assetItemCapacity: [],
    weight: [],
    assetItemType: [],
  });

  assetItemType?: AssetItemType;
  page = 1;
  assetItemCapacityValues = Object.keys(AssetItemCapacity);
  assetItemTypesSharedCollection: AssetItemType[] = [];
  assetItemTypeId = 0;

  constructor(
    private productService: ProductService,
    protected fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected assetService: AssetService,
    protected assetItemService: AssetItemService,
    protected assetItemTypeService: AssetItemTypeService
  ) { }

  ngOnInit(): void {
    // if (this.assetItem) {
    //   this.updateForm(this.assetItem);
    // }
    // this.loadRelationshipsOptions();
  }

  search(query: string): void {
    if (query && StorageComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(this.predicate)) {
      this.predicate = 'id';
      this.ascending = true;
    }
    this.page = 1;
    this.currentSearch = query;
    // this.navigateToWithComponentValues();
    // this.load();
  }

  //   load(): void {
  //     this.loadFromBackendWithRouteInformations().subscribe({
  //       next: (res: EntityAssetArrayResponseType) => {
  //         this.onResponseSuccess(res);
  //       },
  //     });
  //   }

  //   navigateToWithComponentValues(): void {
  //     this.handleNavigation(this.predicate, this.ascending, this.currentSearch);
  //   }

  //   previousState(): void {
  //     window.history.back();
  //   }

  //   save(): void {
  //     this.isSaving = true;
  //     const assetItem = this.createFromForm();
  //     if (assetItem.id !== undefined) {
  //       this.subscribeToSaveResponse(this.assetItemService.update(assetItem));
  //     } else {
  //       this.subscribeToSaveResponse(this.assetItemService.create(assetItem));
  //     }
  //   }

  //   trackAssetItemTypeById(_index: number, item: IAssetItemType): number {
  //     return item.id!;
  //   }

  //   protected loadFromBackendWithRouteInformations(): Observable<EntityAssetArrayResponseType> {
  //     return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
  //       tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
  //       switchMap(() => this.queryBackend(this.predicate, this.ascending, this.currentSearch))
  //     );
  //   }

  //   protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
  //     if (params.has('search') && params.get('search') !== '') {
  //       this.currentSearch = params.get('search') as string;
  //       if (StorageComponent.NOT_SORTABLE_FIELDS_AFTER_SEARCH.includes(this.predicate)) {
  //         this.predicate = '';
  //       }
  //     }
  //   }

  //   protected onResponseSuccess(response: EntityAssetArrayResponseType): void {
  //     const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
  //     this.assets = dataFromBody;
  //     if (this.assets.length > 0) {
  //       this.asset = this.assets[0];
  //       this.loadAssetItemFromBackend(this.asset.assetItem?.id);
  //     }
  //     if (this.assetItem) {
  //       this.updateForm(this.assetItem);
  //     }
  //   }

  //   protected loadAssetItemFromBackend(id: number | null | undefined): void {
  //     if (id === null || id === undefined) {
  //       return;
  //     }
  //     this.assetItemService.find(id).subscribe({
  //       next: (res: EntityAssetItemResponseType) => {
  //         if (res.body) {
  //           this.assetItem = this.fillComponentAttributesFromResponseBodyAssetItem(res.body);
  //           this.assetItemType = this.assetItem.assetItemType;
  //         }
  //       },
  //       error: (err: Error) => {
  //         this.assetItem = this.emptyAssetItem;
  //       },
  //     });
  //   }

  //   protected fillComponentAttributesFromResponseBody(data: IAsset[] | null): IAsset[] {
  //     return data ?? [];
  //   }
  //   protected fillComponentAttributesFromResponseBodyAssetItem(assetItem: IAssetItem): IAssetItem {
  //     this.assetItemTypesSharedCollection = this.assetItemTypeService.addAssetItemTypeToCollectionIfMissing(
  //       this.assetItemTypesSharedCollection,
  //       assetItem.assetItemType
  //     );

  //     this.assetItemType = assetItem.assetItemType;
  //     return assetItem;
  //   }

  //   protected queryBackend(predicate?: string, ascending?: boolean, currentSearch?: string): Observable<EntityAssetArrayResponseType> {
  //     this.isLoading = true;
  //     const queryObject: any = {
  //       eagerload: true,
  //       query: currentSearch,
  //       sort: this.getSortQueryParam(predicate, ascending),
  //     };
  //     if (this.currentSearch && this.currentSearch !== '') {
  //       return this.assetService.search(queryObject).pipe(tap(() => (this.isLoading = false)));
  //     } else {
  //       return this.assetService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  //     }
  //   }

  //   protected handleNavigation(predicate?: string, ascending?: boolean, currentSearch?: string): void {
  //     const queryParamsObj = {
  //       search: currentSearch,
  //       sort: this.getSortQueryParam(predicate, ascending),
  //     };

  //     this.router.navigate(['./'], {
  //       relativeTo: this.activatedRoute,
  //       queryParams: queryParamsObj,
  //     });
  //   }

  //   protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
  //     const ascendingQueryParam = ascending ? ASC : DESC;
  //     if (predicate === '') {
  //       return [];
  //     } else {
  //       return [predicate + ',' + ascendingQueryParam];
  //     }
  //   }

  //   protected loadRelationshipsOptions(): void {
  //     this.assetItemTypeService
  //       .query()
  //       .pipe(map((res: HttpResponse<IAssetItemType[]>) => res.body ?? []))
  //       .pipe(
  //         map((assetItemTypes: IAssetItemType[]) =>
  //           this.assetItemTypeService.addAssetItemTypeToCollectionIfMissing(assetItemTypes, this.assetItem?.assetItemType)
  //         )
  //       )
  //       .subscribe((assetItemTypes: IAssetItemType[]) => (this.assetItemTypesSharedCollection = assetItemTypes));
  //   }

  //   protected subscribeToSaveResponse(result: Observable<HttpResponse<IAssetItem>>): void {
  //     result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
  //       next: () => this.onSaveSuccess(),
  //       error: () => this.onSaveError(),
  //     });
  //   }

  //   protected onSaveSuccess(): void {
  //     this.previousState();
  //   }
  //   protected onSaveError(): void {
  //     // Api for inheritance.
  //   }

  //   protected onSaveFinalize(): void {
  //     this.isSaving = false;
  //   }

  //   protected updateForm(assetItem: IAssetItem): void {
  //     this.editForm.patchValue({
  //       id: assetItem.id,
  //       name: assetItem.name,
  //       assetItemCapacity: assetItem.assetItemCapacity,
  //       weight: assetItem.weight,
  //       assetItemType: assetItem.assetItemType,
  //     });
  //     this.assetItemTypesSharedCollection = this.assetItemTypeService.addAssetItemTypeToCollectionIfMissing(
  //       this.assetItemTypesSharedCollection,
  //       assetItem.assetItemType
  //     );
  //   }

  //   protected createFromForm(): IAssetItem {
  //     return {
  //       ...new AssetItem(),
  //       id: this.editForm.get(['id'])!.value,
  //       name: this.editForm.get(['name'])!.value,
  //       assetItemCapacity: this.editForm.get(['assetItemCapacity'])!.value,
  //       weight: this.editForm.get(['weight'])!.value,
  //       assetItemType: this.editForm.get(['assetItemType'])!.value,
  //     };
  //   }
}
