import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ProductComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-product';
}

export class ProductUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-product-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }

  setPriceInput(price: string) {
    this.setInputValue('price', price);
  }

  setImageInput(image: string) {
    this.setBlob('image', image);
  }

  setMeasurementInput(measurement: string) {
    this.select('measurement', measurement);
  }

  setMeasurementUnitInput(measurementUnit: string) {
    this.select('measurementUnit', measurementUnit);
  }

  setDiscountAmountInput(discountAmount: string) {
    this.setInputValue('discountAmount', discountAmount);
  }

  setDiscountPercentageInput(discountPercentage: string) {
    this.setInputValue('discountPercentage', discountPercentage);
  }

  setWeightInput(weight: string) {
    this.setInputValue('weight', weight);
  }
}

export class ProductDetailPage extends EntityDetailPage {
  pageSelector = 'page-product-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }

  getPriceContent() {
    return cy.get('#price-content');
  }

  getImageContent() {
    return cy.get('#image-content');
  }

  getMeasurementContent() {
    return cy.get('#measurement-content');
  }

  getMeasurementUnitContent() {
    return cy.get('#measurementUnit-content');
  }

  getDiscountAmountContent() {
    return cy.get('#discountAmount-content');
  }

  getDiscountPercentageContent() {
    return cy.get('#discountPercentage-content');
  }

  getWeightContent() {
    return cy.get('#weight-content');
  }
}
