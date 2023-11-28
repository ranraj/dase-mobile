import { BaseEntity } from 'src/model/base-entity';

export class PartyRole implements BaseEntity {
  constructor(public id?: number, public name?: string, public permission?: string) {}
}
