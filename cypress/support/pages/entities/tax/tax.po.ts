import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class TaxComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-tax';
}

export class TaxUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-tax-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setPercentageInput(percentage: string) {
    this.setInputValue('percentage', percentage);
  }

  setTaxationAuthorityInput(taxationAuthority: string) {
    this.select('taxationAuthority', taxationAuthority);
  }
}

export class TaxDetailPage extends EntityDetailPage {
  pageSelector = 'page-tax-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getPercentageContent() {
    return cy.get('#percentage-content');
  }

  getTaxationAuthorityContent() {
    return cy.get('#taxationAuthority-content');
  }
}
