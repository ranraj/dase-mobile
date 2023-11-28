import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AssetMaintenanceComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-asset-maintenance';
}

export class AssetMaintenanceUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-asset-maintenance-update';

  setServiceRunningTimeInput(serviceRunningTime: string) {
    this.setInputValue('serviceRunningTime', serviceRunningTime);
  }

  setServiceRunningTimeMeasurementInput(serviceRunningTimeMeasurement: string) {
    this.select('serviceRunningTimeMeasurement', serviceRunningTimeMeasurement);
  }

  setRestIntervalTimeInput(restIntervalTime: string) {
    this.setInputValue('restIntervalTime', restIntervalTime);
  }

  setRestIntervalTimeMeasurementInput(restIntervalTimeMeasurement: string) {
    this.select('restIntervalTimeMeasurement', restIntervalTimeMeasurement);
  }

  setNextServiceDateInput(nextServiceDate: string) {
    this.setDateTime('nextServiceDate', nextServiceDate);
  }
}

export class AssetMaintenanceDetailPage extends EntityDetailPage {
  pageSelector = 'page-asset-maintenance-detail';

  getServiceRunningTimeContent() {
    return cy.get('#serviceRunningTime-content');
  }

  getServiceRunningTimeMeasurementContent() {
    return cy.get('#serviceRunningTimeMeasurement-content');
  }

  getRestIntervalTimeContent() {
    return cy.get('#restIntervalTime-content');
  }

  getRestIntervalTimeMeasurementContent() {
    return cy.get('#restIntervalTimeMeasurement-content');
  }

  getNextServiceDateContent() {
    return cy.get('#nextServiceDate-content');
  }
}
