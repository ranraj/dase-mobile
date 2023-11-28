import { BaseEntity } from 'src/model/base-entity';
import { Company } from '../company/company.model';
import { User } from '../../../services/user/user.model';
import { OrderItem } from '../order-item/order-item.model';
import { Party } from '../party/party.model';

export const enum OrderStatus {
  'COMPLETED',
  'PAID',
  'PENDING',
  'CANCELLED',
  'REFUNDED',
}

export const enum PaymentMethod {
  'AccountTransfer',
  'Cash',
}

export const enum BillStatus {
  'New',
  'Saved',
  'Draft',
  'Issued',
}

export class Order implements BaseEntity {
  constructor(
    public id?: number,
    public placedDate?: any,
    public status?: OrderStatus,
    public cgst?: number,
    public sgst?: number,
    public totalPrice?: number,
    public paymentMethod?: PaymentMethod,
    public paymentReference?: string,
    public billingStatus?: BillStatus,
    public company?: Company,
    public user?: User,
    public orderItems?: OrderItem[],
    public party?: Party
  ) {}
}
