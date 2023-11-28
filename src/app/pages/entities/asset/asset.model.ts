import { BaseEntity } from 'src/model/base-entity';
import { AssetItem } from '../asset-item/asset-item.model';
import { AssetMaintenance } from '../asset-maintenance/asset-maintenance.model';
import { AssetPurchase } from '../asset-purchase/asset-purchase.model';
import { Facility } from '../facility/facility.model';
import { AssetCategory } from '../asset-category/asset-category.model';

export const enum AssetType {
  'Moveable',
  'Fixed',
}

export const enum AssetOwnership {
  'Own',
  'Lended',
  'Shared',
}

export const enum MeasurementUnit {
  'Gram',
  'Kilogram',
  'Litter',
  'Milli_litter',
  'No',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
}

export const enum MeasurementTime {
  'Seconds',
  'Minutes',
  'Hours',
  'Days',
  'Months',
  'Years',
}

export class Asset implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public code?: string,
    public assetType?: AssetType,
    public assetOwnership?: AssetOwnership,
    public isEmpty?: boolean,
    public maxCapacity?: number,
    public maxCapacityMeasurement?: MeasurementUnit,
    public maxRunningTime?: number,
    public maxRunningTimeMeasurement?: MeasurementTime,
    public assetItem?: AssetItem,
    public maintenance?: AssetMaintenance,
    public purchase?: AssetPurchase,
    public facility?: Facility,
    public assetCategories?: AssetCategory[]
  ) {
    this.isEmpty = false;
  }
}
