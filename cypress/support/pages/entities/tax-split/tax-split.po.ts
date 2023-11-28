import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class TaxSplitComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-tax-split';
}

export class TaxSplitUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-tax-split-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setPercentageInput(percentage: string) {
    this.setInputValue('percentage', percentage);
  }
}

export class TaxSplitDetailPage extends EntityDetailPage {
  pageSelector = 'page-tax-split-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getPercentageContent() {
    return cy.get('#percentage-content');
  }
}
