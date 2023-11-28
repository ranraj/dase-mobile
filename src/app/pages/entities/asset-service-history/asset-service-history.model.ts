import { BaseEntity } from 'src/model/base-entity';
import { Party } from '../party/party.model';

export class AssetServiceHistory implements BaseEntity {
  constructor(public id?: number, public serviceDate?: any, public isPaid?: boolean, public serviceAmount?: number, public vendor?: Party) {
    this.isPaid = false;
  }
}
