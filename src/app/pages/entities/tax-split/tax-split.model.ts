import { BaseEntity } from 'src/model/base-entity';
import { Tax } from '../tax/tax.model';

export class TaxSplit implements BaseEntity {
  constructor(public id?: number, public name?: string, public percentage?: number, public tax?: Tax) {}
}
