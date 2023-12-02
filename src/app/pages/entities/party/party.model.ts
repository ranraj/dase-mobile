import { BaseEntity } from 'src/model/base-entity';
import { Order } from '../order/order.model';
import { Company } from '../company/company.model';
import { Address } from '../address/address.model';

export const enum PartyPrimaryType {
  'Employee',
  'Vendor',
  'Customer',
  'Supplier',
  'Guest',
  'Other',
}

export class Party implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public email?: string,
    public gstNo?: string,
    public phone?: string,
    public comments?: string,
    public primaryType?: PartyPrimaryType,
    public orders?: Order[],
    public company?: Company,
    public addresses?: Address[]
  ) {}
}
