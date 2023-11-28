import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { Company, CompanyService } from '../company';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';
import { Party, PartyService } from '../party';

@Component({
  selector: 'page-order-update',
  templateUrl: 'order-update.html',
})
export class OrderUpdatePage implements OnInit {
  order: Order;
  companies: Company[];
  users: User[];
  parties: Party[];
  placedDate: string;
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    placedDate: [null, [Validators.required]],
    status: [null, [Validators.required]],
    cgst: [null, [Validators.required]],
    sgst: [null, [Validators.required]],
    totalPrice: [null, [Validators.required]],
    paymentMethod: [null, [Validators.required]],
    paymentReference: [null, []],
    billingStatus: [null, []],
    company: [null, [Validators.required]],
    user: [null, [Validators.required]],
    party: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private companyService: CompanyService,
    private userService: UserService,
    private partyService: PartyService,
    private orderService: OrderService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.companyService.query({ filter: 'order-is-null' }).subscribe(
      data => {
        if (!this.order.company || !this.order.company.id) {
          this.companies = data.body;
        } else {
          this.companyService.find(this.order.company.id).subscribe(
            (subData: HttpResponse<Company>) => {
              this.companies = [subData.body].concat(subData.body);
            },
            error => this.onError(error)
          );
        }
      },
      error => this.onError(error)
    );
    this.userService.findAll().subscribe(
      data => (this.users = data),
      error => this.onError(error)
    );
    this.partyService.query().subscribe(
      data => {
        this.parties = data.body;
      },
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.order = response.data;
      this.isNew = this.order.id === null || this.order.id === undefined;
      this.updateForm(this.order);
    });
  }

  updateForm(order: Order) {
    this.form.patchValue({
      id: order.id,
      placedDate: this.isNew ? new Date().toISOString() : order.placedDate,
      status: order.status,
      cgst: order.cgst,
      sgst: order.sgst,
      totalPrice: order.totalPrice,
      paymentMethod: order.paymentMethod,
      paymentReference: order.paymentReference,
      billingStatus: order.billingStatus,
      company: order.company,
      user: order.user,
      party: order.party,
    });
  }

  save() {
    this.isSaving = true;
    const order = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.orderService.update(order));
    } else {
      this.subscribeToSaveResponse(this.orderService.create(order));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Order ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/order');
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

  compareCompany(first: Company, second: Company): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackCompanyById(index: number, item: Company) {
    return item.id;
  }
  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }
  compareParty(first: Party, second: Party): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackPartyById(index: number, item: Party) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Order>>) {
    result.subscribe(
      (res: HttpResponse<Order>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Order {
    return {
      ...new Order(),
      id: this.form.get(['id']).value,
      placedDate: new Date(this.form.get(['placedDate']).value),
      status: this.form.get(['status']).value,
      cgst: this.form.get(['cgst']).value,
      sgst: this.form.get(['sgst']).value,
      totalPrice: this.form.get(['totalPrice']).value,
      paymentMethod: this.form.get(['paymentMethod']).value,
      paymentReference: this.form.get(['paymentReference']).value,
      billingStatus: this.form.get(['billingStatus']).value,
      company: this.form.get(['company']).value,
      user: this.form.get(['user']).value,
      party: this.form.get(['party']).value,
    };
  }
}
