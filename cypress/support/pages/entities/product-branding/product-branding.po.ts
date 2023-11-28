import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ProductBrandingComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-product-branding';
}

export class ProductBrandingUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-product-branding-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }

  setPriceInput(price: string) {
    this.setInputValue('price', price);
  }

  setImageSrcInput(imageSrc: string) {
    this.setInputValue('imageSrc', imageSrc);
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
}

export class ProductBrandingDetailPage extends EntityDetailPage {
  pageSelector = 'page-product-branding-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }

  getPriceContent() {
    return cy.get('#price-content');
  }

  getImageSrcContent() {
    return cy.get('#imageSrc-content');
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
}
