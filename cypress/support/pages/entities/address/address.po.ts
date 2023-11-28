import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AddressComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-address';
}

export class AddressUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-address-update';

  setAddressLine1Input(addressLine1: string) {
    this.setInputValue('addressLine1', addressLine1);
  }

  setAddressLine2Input(addressLine2: string) {
    this.setInputValue('addressLine2', addressLine2);
  }

  setLocalStateInput(localState: string) {
    this.setInputValue('localState', localState);
  }

  setCityInput(city: string) {
    this.setInputValue('city', city);
  }

  setCountryInput(country: string) {
    this.setInputValue('country', country);
  }

  setPostalCodeInput(postalCode: string) {
    this.setInputValue('postalCode', postalCode);
  }

  setAddressTypeInput(addressType: string) {
    this.select('addressType', addressType);
  }
}

export class AddressDetailPage extends EntityDetailPage {
  pageSelector = 'page-address-detail';

  getAddressLine1Content() {
    return cy.get('#addressLine1-content');
  }

  getAddressLine2Content() {
    return cy.get('#addressLine2-content');
  }

  getLocalStateContent() {
    return cy.get('#localState-content');
  }

  getCityContent() {
    return cy.get('#city-content');
  }

  getCountryContent() {
    return cy.get('#country-content');
  }

  getPostalCodeContent() {
    return cy.get('#postalCode-content');
  }

  getAddressTypeContent() {
    return cy.get('#addressType-content');
  }
}
