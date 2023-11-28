import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AssetItemTypeComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-asset-item-type';
}

export class AssetItemTypeUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-asset-item-type-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setCodeInput(code: string) {
    this.setInputValue('code', code);
  }
}

export class AssetItemTypeDetailPage extends EntityDetailPage {
  pageSelector = 'page-asset-item-type-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getCodeContent() {
    return cy.get('#code-content');
  }
}
