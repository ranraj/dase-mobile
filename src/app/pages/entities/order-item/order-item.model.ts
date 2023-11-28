import { BaseEntity } from 'src/model/base-entity';
import { Product } from '../product/product.model';
import { Order } from '../order/order.model';

export class OrderItem implements BaseEntity {
  constructor(
    public id?: number,
    public unitPrice?: number,
    public quantity?: number,
    public totalPrice?: number,
    public product?: Product,
    public order?: Order
  ) {}
}
