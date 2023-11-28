import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class OrderComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-order';
}

export class OrderUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-order-update';

  setPlacedDateInput(placedDate: string) {
    this.setDateTime('placedDate', placedDate);
  }

  setStatusInput(status: string) {
    this.select('status', status);
  }

  setCgstInput(cgst: string) {
    this.setInputValue('cgst', cgst);
  }

  setSgstInput(sgst: string) {
    this.setInputValue('sgst', sgst);
  }

  setTotalPriceInput(totalPrice: string) {
    this.setInputValue('totalPrice', totalPrice);
  }

  setPaymentMethodInput(paymentMethod: string) {
    this.select('paymentMethod', paymentMethod);
  }

  setPaymentReferenceInput(paymentReference: string) {
    this.setInputValue('paymentReference', paymentReference);
  }

  setBillingStatusInput(billingStatus: string) {
    this.select('billingStatus', billingStatus);
  }
}

export class OrderDetailPage extends EntityDetailPage {
  pageSelector = 'page-order-detail';

  getPlacedDateContent() {
    return cy.get('#placedDate-content');
  }

  getStatusContent() {
    return cy.get('#status-content');
  }

  getCgstContent() {
    return cy.get('#cgst-content');
  }

  getSgstContent() {
    return cy.get('#sgst-content');
  }

  getTotalPriceContent() {
    return cy.get('#totalPrice-content');
  }

  getPaymentMethodContent() {
    return cy.get('#paymentMethod-content');
  }

  getPaymentReferenceContent() {
    return cy.get('#paymentReference-content');
  }

  getBillingStatusContent() {
    return cy.get('#billingStatus-content');
  }
}
