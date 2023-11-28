import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AssetPurchaseComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-asset-purchase';
}

export class AssetPurchaseUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-asset-purchase-update';

  setPurchaseDateInput(purchaseDate: string) {
    this.setDateTime('purchaseDate', purchaseDate);
  }

  setAmountInput(amount: string) {
    this.setInputValue('amount', amount);
  }

  setPaymentDateInput(paymentDate: string) {
    this.setDateTime('paymentDate', paymentDate);
  }

  setPaymentMethodInput(paymentMethod: string) {
    this.select('paymentMethod', paymentMethod);
  }

  setPaymentReferenceInput(paymentReference: string) {
    this.setInputValue('paymentReference', paymentReference);
  }

  setPaymentStatusInput(paymentStatus: string) {
    this.select('paymentStatus', paymentStatus);
  }
}

export class AssetPurchaseDetailPage extends EntityDetailPage {
  pageSelector = 'page-asset-purchase-detail';

  getPurchaseDateContent() {
    return cy.get('#purchaseDate-content');
  }

  getAmountContent() {
    return cy.get('#amount-content');
  }

  getPaymentDateContent() {
    return cy.get('#paymentDate-content');
  }

  getPaymentMethodContent() {
    return cy.get('#paymentMethod-content');
  }

  getPaymentReferenceContent() {
    return cy.get('#paymentReference-content');
  }

  getPaymentStatusContent() {
    return cy.get('#paymentStatus-content');
  }
}
