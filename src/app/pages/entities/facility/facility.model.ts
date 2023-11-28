import { BaseEntity } from 'src/model/base-entity';
import { Address } from '../address/address.model';
import { Company } from '../company/company.model';
import { User } from '../../../services/user/user.model';

export class Facility implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public geoLocation?: string,
    public addresses?: Address[],
    public company?: Company,
    public user?: User
  ) {}
}
