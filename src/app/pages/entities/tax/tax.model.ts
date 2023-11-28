import { BaseEntity } from 'src/model/base-entity';
import { TaxSplit } from '../tax-split/tax-split.model';

export const enum TaxationAuthority {
  'IND',
  'US',
}

export class Tax implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public percentage?: number,
    public taxationAuthority?: TaxationAuthority,
    public splits?: TaxSplit[]
  ) {}
}
