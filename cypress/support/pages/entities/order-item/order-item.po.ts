import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class OrderItemComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-order-item';
}

export class OrderItemUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-order-item-update';

  setUnitPriceInput(unitPrice: string) {
    this.setInputValue('unitPrice', unitPrice);
  }

  setQuantityInput(quantity: string) {
    this.setInputValue('quantity', quantity);
  }

  setTotalPriceInput(totalPrice: string) {
    this.setInputValue('totalPrice', totalPrice);
  }
}

export class OrderItemDetailPage extends EntityDetailPage {
  pageSelector = 'page-order-item-detail';

  getUnitPriceContent() {
    return cy.get('#unitPrice-content');
  }

  getQuantityContent() {
    return cy.get('#quantity-content');
  }

  getTotalPriceContent() {
    return cy.get('#totalPrice-content');
  }
}
