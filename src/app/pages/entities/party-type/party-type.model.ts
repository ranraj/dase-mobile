import { BaseEntity } from 'src/model/base-entity';

export class PartyType implements BaseEntity {
  constructor(public id?: number, public name?: string, public comment?: string) {}
}
