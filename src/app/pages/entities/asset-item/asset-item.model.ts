import { BaseEntity } from 'src/model/base-entity';
import { AssetItemType } from '../asset-item-type/asset-item-type.model';

export enum AssetItemCapacity {
  'Empty',
  'Quarter',
  'Half',
  'Full',
}

export class AssetItem implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string | null,
    public assetItemCapacity?: AssetItemCapacity,
    public weight?: number,
    public assetItemType?: AssetItemType
  ) { }
}
