import { BaseEntity } from 'src/model/base-entity';

export class AssetItemType implements BaseEntity {
  constructor(public id?: number, public name?: string, public code?: string) {}
}
