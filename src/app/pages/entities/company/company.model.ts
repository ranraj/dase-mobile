import { BaseEntity } from 'src/model/base-entity';
import { Address } from '../address/address.model';
import { Organisation } from '../organisation/organisation.model';
import { User } from '../../../services/user/user.model';

export const enum GstType {
  'CGST_SGST',
  'IGST',
}

export const enum CurrencyType {
  'INR (₹ - INR)',
  'USD ($ - USD)',
}

export class Company implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public displayName?: string,
    public email?: string,
    public gstNo?: string,
    public phone?: string,
    public website?: string,
    public imageSrc?: string,
    public gstType?: GstType,
    public currencyType?: CurrencyType,
    public geoLocation?: string,
    public addresses?: Address[],
    public orgnisation?: Organisation,
    public parent?: Company,
    public user?: User
  ) {}
}
