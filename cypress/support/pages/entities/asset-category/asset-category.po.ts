import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AssetCategoryComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-asset-category';
}

export class AssetCategoryUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-asset-category-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDescriptionInput(description: string) {
    this.setInputValue('description', description);
  }
}

export class AssetCategoryDetailPage extends EntityDetailPage {
  pageSelector = 'page-asset-category-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDescriptionContent() {
    return cy.get('#description-content');
  }
}
