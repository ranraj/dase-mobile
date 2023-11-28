import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class CompanyComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-company';
}

export class CompanyUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-company-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDisplayNameInput(displayName: string) {
    this.setInputValue('displayName', displayName);
  }

  setEmailInput(email: string) {
    this.setInputValue('email', email);
  }

  setGstNoInput(gstNo: string) {
    this.setInputValue('gstNo', gstNo);
  }

  setPhoneInput(phone: string) {
    this.setInputValue('phone', phone);
  }

  setWebsiteInput(website: string) {
    this.setInputValue('website', website);
  }

  setImageSrcInput(imageSrc: string) {
    this.setInputValue('imageSrc', imageSrc);
  }

  setGstTypeInput(gstType: string) {
    this.select('gstType', gstType);
  }

  setCurrencyTypeInput(currencyType: string) {
    this.select('currencyType', currencyType);
  }

  setGeoLocationInput(geoLocation: string) {
    this.setInputValue('geoLocation', geoLocation);
  }
}

export class CompanyDetailPage extends EntityDetailPage {
  pageSelector = 'page-company-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDisplayNameContent() {
    return cy.get('#displayName-content');
  }

  getEmailContent() {
    return cy.get('#email-content');
  }

  getGstNoContent() {
    return cy.get('#gstNo-content');
  }

  getPhoneContent() {
    return cy.get('#phone-content');
  }

  getWebsiteContent() {
    return cy.get('#website-content');
  }

  getImageSrcContent() {
    return cy.get('#imageSrc-content');
  }

  getGstTypeContent() {
    return cy.get('#gstType-content');
  }

  getCurrencyTypeContent() {
    return cy.get('#currencyType-content');
  }

  getGeoLocationContent() {
    return cy.get('#geoLocation-content');
  }
}
