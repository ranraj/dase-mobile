import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class PartyComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-party';
}

export class PartyUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-party-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
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

  setCommentsInput(comments: string) {
    this.setInputValue('comments', comments);
  }

  setPrimaryTypeInput(primaryType: string) {
    this.select('primaryType', primaryType);
  }
}

export class PartyDetailPage extends EntityDetailPage {
  pageSelector = 'page-party-detail';

  getNameContent() {
    return cy.get('#name-content');
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

  getCommentsContent() {
    return cy.get('#comments-content');
  }

  getPrimaryTypeContent() {
    return cy.get('#primaryType-content');
  }
}
