import { BaseEntity } from 'src/model/base-entity';
import { Company } from '../company/company.model';
import { ProductAttributes } from '../product-attributes/product-attributes.model';
import { Tax } from '../tax/tax.model';
import { ProductCategory } from '../product-category/product-category.model';

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

export class Product implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public price?: number,
    public imageContentType?: string,
    public image?: any,
    public measurement?: ProductMeasurementType,
    public measurementUnit?: MeasurementUnit,
    public discountAmount?: number,
    public discountPercentage?: number,
    public weight?: number,
    public createdBy?: Company,
    public attributes?: ProductAttributes[],
    public tax?: Tax,
    public productCategory?: ProductCategory
  ) {}
}
