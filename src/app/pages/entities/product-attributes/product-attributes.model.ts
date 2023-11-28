import { BaseEntity } from 'src/model/base-entity';
import { Product } from '../product/product.model';
import { ProductBranding } from '../product-branding/product-branding.model';
import { ProductVariation } from '../product-variation/product-variation.model';
import { ProductVariationBranding } from '../product-variation-branding/product-variation-branding.model';

export class ProductAttributes implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public value?: string,
    public comments?: string,
    public hidden?: boolean,
    public internal?: boolean,
    public product?: Product,
    public productBranding?: ProductBranding,
    public productVariation?: ProductVariation,
    public productVariationBranding?: ProductVariationBranding
  ) {
    this.hidden = false;
    this.internal = false;
  }
}
