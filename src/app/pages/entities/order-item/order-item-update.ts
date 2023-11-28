import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderItem } from './order-item.model';
import { OrderItemService } from './order-item.service';
import { Product, ProductService } from '../product';
import { Order, OrderService } from '../order';

@Component({
  selector: 'page-order-item-update',
  templateUrl: 'order-item-update.html',
})
export class OrderItemUpdatePage implements OnInit {
  orderItem: OrderItem;
  products: Product[];
  orders: Order[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    unitPrice: [null, [Validators.required]],
    quantity: [null, [Validators.required]],
    totalPrice: [null, [Validators.required]],
    product: [null, [Validators.required]],
    order: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private productService: ProductService,
    private orderService: OrderService,
    private orderItemService: OrderItemService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.productService.query().subscribe(
      data => {
        this.products = data.body;
      },
      error => this.onError(error)
    );
    this.orderService.query().subscribe(
      data => {
        this.orders = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.orderItem = response.data;
      this.isNew = this.orderItem.id === null || this.orderItem.id === undefined;
      this.updateForm(this.orderItem);
    });
  }

  updateForm(orderItem: OrderItem) {
    this.form.patchValue({
      id: orderItem.id,
      unitPrice: orderItem.unitPrice,
      quantity: orderItem.quantity,
      totalPrice: orderItem.totalPrice,
      product: orderItem.product,
      order: orderItem.order,
    });
  }

  save() {
    this.isSaving = true;
    const orderItem = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.orderItemService.update(orderItem));
    } else {
      this.subscribeToSaveResponse(this.orderItemService.create(orderItem));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `OrderItem ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/order-item');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  compareProduct(first: Product, second: Product): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackProductById(index: number, item: Product) {
    return item.id;
  }
  compareOrder(first: Order, second: Order): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackOrderById(index: number, item: Order) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<OrderItem>>) {
    result.subscribe(
      (res: HttpResponse<OrderItem>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): OrderItem {
    return {
      ...new OrderItem(),
      id: this.form.get(['id']).value,
      unitPrice: this.form.get(['unitPrice']).value,
      quantity: this.form.get(['quantity']).value,
      totalPrice: this.form.get(['totalPrice']).value,
      product: this.form.get(['product']).value,
      order: this.form.get(['order']).value,
    };
  }
}
