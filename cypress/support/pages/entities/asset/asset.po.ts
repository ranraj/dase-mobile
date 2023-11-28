import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AssetComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-asset';
}

export class AssetUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-asset-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setCodeInput(code: string) {
    this.setInputValue('code', code);
  }

  setAssetTypeInput(assetType: string) {
    this.select('assetType', assetType);
  }

  setAssetOwnershipInput(assetOwnership: string) {
    this.select('assetOwnership', assetOwnership);
  }

  setIsEmptyInput(isEmpty: string) {
    this.setBoolean('isEmpty', isEmpty);
  }

  setMaxCapacityInput(maxCapacity: string) {
    this.setInputValue('maxCapacity', maxCapacity);
  }

  setMaxCapacityMeasurementInput(maxCapacityMeasurement: string) {
    this.select('maxCapacityMeasurement', maxCapacityMeasurement);
  }

  setMaxRunningTimeInput(maxRunningTime: string) {
    this.setInputValue('maxRunningTime', maxRunningTime);
  }

  setMaxRunningTimeMeasurementInput(maxRunningTimeMeasurement: string) {
    this.select('maxRunningTimeMeasurement', maxRunningTimeMeasurement);
  }
}

export class AssetDetailPage extends EntityDetailPage {
  pageSelector = 'page-asset-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getCodeContent() {
    return cy.get('#code-content');
  }

  getAssetTypeContent() {
    return cy.get('#assetType-content');
  }

  getAssetOwnershipContent() {
    return cy.get('#assetOwnership-content');
  }

  getIsEmptyContent() {
    return cy.get('#isEmpty-content');
  }

  getMaxCapacityContent() {
    return cy.get('#maxCapacity-content');
  }

  getMaxCapacityMeasurementContent() {
    return cy.get('#maxCapacityMeasurement-content');
  }

  getMaxRunningTimeContent() {
    return cy.get('#maxRunningTime-content');
  }

  getMaxRunningTimeMeasurementContent() {
    return cy.get('#maxRunningTimeMeasurement-content');
  }
}
