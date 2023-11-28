import { BaseEntity } from 'src/model/base-entity';
import { Party } from '../party/party.model';

export const enum PaymentMethod {
  'AccountTransfer',
  'Cash',
}

export const enum PaymentStatus {
  'Pending',
  'Approved',
  'PartialPaid',
  'Instalment',
  'Paid',
  'Accepted',
  'Completed',
  'Refunded',
}

export class AssetPurchase implements BaseEntity {
  constructor(
    public id?: number,
    public purchaseDate?: any,
    public amount?: number,
    public paymentDate?: any,
    public paymentMethod?: PaymentMethod,
    public paymentReference?: string,
    public paymentStatus?: PaymentStatus,
    public vendor?: Party
  ) {}
}
