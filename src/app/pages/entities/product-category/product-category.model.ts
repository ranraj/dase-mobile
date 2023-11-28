import { BaseEntity } from 'src/model/base-entity';
import { Product } from '../product/product.model';

export class ProductCategory implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public products?: Product[],
    public parentCategory?: ProductCategory
  ) {}
}
