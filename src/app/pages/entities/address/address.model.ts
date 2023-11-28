import { BaseEntity } from 'src/model/base-entity';
import { Party } from '../party/party.model';
import { Company } from '../company/company.model';
import { Facility } from '../facility/facility.model';

export const enum AddressType {
  'Primary',
  'Secondary',
  'Shipping',
  'Billing',
}

export class Address implements BaseEntity {
  constructor(
    public id?: number,
    public addressLine1?: string,
    public addressLine2?: string,
    public localState?: string,
    public city?: string,
    public country?: string,
    public postalCode?: string,
    public addressType?: AddressType,
    public party?: Party,
    public company?: Company,
    public facility?: Facility
  ) {}
}
