import { BaseEntity } from 'src/model/base-entity';
import { Company } from '../company/company.model';
import { ProductAttributes } from '../product-attributes/product-attributes.model';
import { Product } from '../product/product.model';

export const enum ProductMeasurementType {
  'Weight',
  'Size',
  'Litter',
  'Count',
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

export class ProductBranding implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public price?: number,
    public imageSrc?: string,
    public measurement?: ProductMeasurementType,
    public measurementUnit?: MeasurementUnit,
    public discountAmount?: number,
    public discountPercentage?: number,
    public company?: Company,
    public attributes?: ProductAttributes[],
    public product?: Product
  ) {}
}
