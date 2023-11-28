import { BaseEntity } from 'src/model/base-entity';
import { Company } from '../company/company.model';
import { User } from '../../../services/user/user.model';

export class Catalog implements BaseEntity {
  constructor(
    public id?: number,
    public name?: string,
    public active?: boolean,
    public activeOn?: any,
    public createdDate?: any,
    public company?: Company,
    public user?: User
  ) {
    this.active = false;
  }
}
