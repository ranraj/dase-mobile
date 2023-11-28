import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class CatalogComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-catalog';
}

export class CatalogUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-catalog-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setActiveInput(active: string) {
    this.setBoolean('active', active);
  }

  setActiveOnInput(activeOn: string) {
    this.setDateTime('activeOn', activeOn);
  }

  setCreatedDateInput(createdDate: string) {
    this.setDateTime('createdDate', createdDate);
  }
}

export class CatalogDetailPage extends EntityDetailPage {
  pageSelector = 'page-catalog-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getActiveContent() {
    return cy.get('#active-content');
  }

  getActiveOnContent() {
    return cy.get('#activeOn-content');
  }

  getCreatedDateContent() {
    return cy.get('#createdDate-content');
  }
}
