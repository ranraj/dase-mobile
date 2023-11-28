import { BaseEntity } from 'src/model/base-entity';
import { Asset } from '../asset/asset.model';

export class AssetCategory implements BaseEntity {
  constructor(public id?: number, public name?: string, public description?: string, public assets?: Asset[]) {}
}
