import { BaseEntity } from 'src/model/base-entity';
import { User } from '../../../services/user/user.model';

export class Organisation implements BaseEntity {
  constructor(public id?: number, public name?: string, public domain?: string, public cname?: string, public user?: User) {}
}
