import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class AssetServiceHistoryComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-asset-service-history';
}

export class AssetServiceHistoryUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-asset-service-history-update';

  setServiceDateInput(serviceDate: string) {
    this.setDateTime('serviceDate', serviceDate);
  }

  setIsPaidInput(isPaid: string) {
    this.setBoolean('isPaid', isPaid);
  }

  setServiceAmountInput(serviceAmount: string) {
    this.setInputValue('serviceAmount', serviceAmount);
  }
}

export class AssetServiceHistoryDetailPage extends EntityDetailPage {
  pageSelector = 'page-asset-service-history-detail';

  getServiceDateContent() {
    return cy.get('#serviceDate-content');
  }

  getIsPaidContent() {
    return cy.get('#isPaid-content');
  }

  getServiceAmountContent() {
    return cy.get('#serviceAmount-content');
  }
}
