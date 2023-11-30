import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AssetItemType } from '../../entities/asset-item-type/asset-item-type.model';
import { AssetItemTypeService } from '../../entities/asset-item-type/asset-item-type.service';
import { Asset } from '../../entities/asset/asset.model';
import { AssetService } from '../../entities/asset/asset.service';
import { AssetItemService } from '../../entities/asset-item/asset-item.service';
import { AssetItem } from '../../entities/asset-item/asset-item.model';

@Component({
  selector: 'jhi-storage-dashboard',
  templateUrl: './storage-dashboard.component.html',
  styleUrls: ['./storage-dashboard.component.scss'],
})
export class StorageDashboardComponent implements OnInit {
  isLoading = false;
  assetItemTypes: AssetItemType[] = [];
  assets: Asset[] = [];
  assetItems: AssetItem[] = [];
  assetItemMap: Map<number | undefined, string | undefined> = new Map();
  inventory: InventoryDisplay[] = [];
  inventoryTotal = 0;
  constructor(
    protected assetItemTypeService: AssetItemTypeService,
    protected assetService: AssetService,
    protected assetItemService: AssetItemService
  ) { }

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): void {
    this.isLoading = true;

    this.loadAllAssets();

    this.loadAllAssetItems();
  }
  protected loadAllAssetItemTypes(): void {
    this.assetItemTypeService.query().subscribe({
      next: (res: HttpResponse<AssetItemType[]>) => {
        this.isLoading = false;
        this.assetItemTypes = res.body ?? [];
        this.assetItemTypes.forEach(a => this.assetItemMap.set(a.id, a.name));
        this.buildAssetItemsGroupByTypes();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  protected loadAllAssetItems(): void {
    this.assetItemService.query().subscribe({
      next: (res: HttpResponse<AssetItem[]>) => {
        this.isLoading = false;
        this.assetItems = res.body ?? [];
        this.loadAllAssetItemTypes();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  protected loadAllAssets(): void {
    this.assetService.query().subscribe({
      next: (res: HttpResponse<Asset[]>) => {
        this.isLoading = false;
        this.assets = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  protected buildAssetItemsGroupByTypes(): void {
    const stock = new Map<number | undefined, number>();
    let total = 0;
    this.assetItems.forEach(a => {
      if (a.weight !== undefined && a.weight !== null) {
        total += a.weight;
      }
      if (stock.get(a.assetItemType?.id)) {
        const count = stock.get(a.assetItemType?.id);
        if (a.weight !== null && a.weight !== undefined) {
          if (count === undefined) {
            stock.set(a.assetItemType?.id, a.weight);
          } else {
            stock.set(a.assetItemType?.id, a.weight + count);
          }
        }
      } else {
        if (a.weight !== null && a.weight !== undefined) {
          stock.set(a.assetItemType?.id, a.weight);
        }
      }
    });
    this.inventory = [];
    stock.forEach((value, key) => {
      const keyDefault = this.assetItemMap.get(key) === undefined ? 'Others' : this.assetItemMap.get(key);
      this.inventory.push(new InventoryDisplay(key, keyDefault, value));
    });
    this.inventoryTotal = total;
  }
}

class InventoryDisplay {
  id?: number;
  assetType?: string;
  itemWeightTotal: number;
  constructor(id: number | undefined, assetType: string | undefined, itemWeightTotal: number) {
    this.id = id;
    this.assetType = assetType;
    this.itemWeightTotal = itemWeightTotal;
  }
}
