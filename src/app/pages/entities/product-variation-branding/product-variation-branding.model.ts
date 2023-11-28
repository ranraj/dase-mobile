import { BaseEntity } from 'src/model/base-entity';
import { ProductAttributes } from '../product-attributes/product-attributes.model';
import { ProductVariation } from '../product-variation/product-variation.model';
import { Tax } from '../tax/tax.model';

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

export class ProductVariationBranding implements BaseEntity {
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
    public attributes?: ProductAttributes[],
    public productVariation?: ProductVariation,
    public tax?: Tax
  ) {}
}
