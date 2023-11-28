import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AssetItemComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-asset-item';
}

export class AssetItemUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-asset-item-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setAssetItemCapacityInput(assetItemCapacity: string) {
    this.select('assetItemCapacity', assetItemCapacity);
  }

  setWeightInput(weight: string) {
    this.setInputValue('weight', weight);
  }
}

export class AssetItemDetailPage extends EntityDetailPage {
  pageSelector = 'page-asset-item-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getAssetItemCapacityContent() {
    return cy.get('#assetItemCapacity-content');
  }

  getWeightContent() {
    return cy.get('#weight-content');
  }
}
