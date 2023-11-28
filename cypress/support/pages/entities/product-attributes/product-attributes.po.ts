import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class ProductAttributesComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-product-attributes';
}

export class ProductAttributesUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-product-attributes-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setValueInput(value: string) {
    this.setInputValue('value', value);
  }

  setCommentsInput(comments: string) {
    this.setInputValue('comments', comments);
  }

  setHiddenInput(hidden: string) {
    this.setBoolean('hidden', hidden);
  }

  setInternalInput(internal: string) {
    this.setBoolean('internal', internal);
  }
}

export class ProductAttributesDetailPage extends EntityDetailPage {
  pageSelector = 'page-product-attributes-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getValueContent() {
    return cy.get('#value-content');
  }

  getCommentsContent() {
    return cy.get('#comments-content');
  }

  getHiddenContent() {
    return cy.get('#hidden-content');
  }

  getInternalContent() {
    return cy.get('#internal-content');
  }
}
