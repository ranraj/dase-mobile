import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  AssetMaintenanceComponentsPage,
  AssetMaintenanceDetailPage,
  AssetMaintenanceUpdatePage,
} from '../../../support/pages/entities/asset-maintenance/asset-maintenance.po';
import assetMaintenanceSample from './asset-maintenance.json';

describe('AssetMaintenance entity', () => {
  const COMPONENT_TITLE = 'Asset Maintenances';
  const SUBCOMPONENT_TITLE = 'Asset Maintenance';

  const assetMaintenancePageUrl = '/tabs/entities/asset-maintenance';
  const assetMaintenanceApiUrl = '/api/asset-maintenances';

  const assetMaintenanceComponentsPage = new AssetMaintenanceComponentsPage();
  const assetMaintenanceUpdatePage = new AssetMaintenanceUpdatePage();
  const assetMaintenanceDetailPage = new AssetMaintenanceDetailPage();

  let assetMaintenance: any;

  beforeEach(() => {
    assetMaintenance = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load AssetMaintenances page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      assetMaintenanceComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', assetMaintenancePageUrl);

      assetMaintenanceComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create AssetMaintenance page and go back', () => {
      cy.visit(assetMaintenancePageUrl);
      assetMaintenanceComponentsPage.clickOnCreateButton();

      assetMaintenanceUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      assetMaintenanceUpdatePage.back();
      cy.url().should('include', assetMaintenancePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: assetMaintenanceApiUrl,
        body: assetMaintenanceSample,
      }).then(({ body }) => {
        assetMaintenance = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${assetMaintenanceApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [assetMaintenance],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (assetMaintenance) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetMaintenanceApiUrl}/${assetMaintenance.id}`,
        }).then(() => {
          assetMaintenance = undefined;
        });
      }
    });

    it('should open AssetMaintenance view, open AssetMaintenance edit and go back', () => {
      cy.visit(assetMaintenancePageUrl);
      assetMaintenanceComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetMaintenanceDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (assetMaintenance.serviceRunningTime !== undefined && assetMaintenance.serviceRunningTime !== null) {
        assetMaintenanceDetailPage.getServiceRunningTimeContent().contains(assetMaintenance.serviceRunningTime);
      }
      if (assetMaintenance.restIntervalTime !== undefined && assetMaintenance.restIntervalTime !== null) {
        assetMaintenanceDetailPage.getRestIntervalTimeContent().contains(assetMaintenance.restIntervalTime);
      }
      assetMaintenanceDetailPage.edit();

      assetMaintenanceUpdatePage.back();
      assetMaintenanceDetailPage.back();
      cy.url().should('include', assetMaintenancePageUrl);
    });

    it('should open AssetMaintenance view, open AssetMaintenance edit and save', () => {
      cy.visit(assetMaintenancePageUrl);
      assetMaintenanceComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetMaintenanceDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      assetMaintenanceDetailPage.edit();

      assetMaintenanceUpdatePage.save();
      cy.url().should('include', assetMaintenancePageUrl);
    });

    it('should delete AssetMaintenance', () => {
      cy.visit(assetMaintenancePageUrl);
      assetMaintenanceComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetMaintenanceDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      assetMaintenanceComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      assetMaintenance = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: assetMaintenanceApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (assetMaintenance) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetMaintenanceApiUrl}/${assetMaintenance.id}`,
        }).then(() => {
          assetMaintenance = undefined;
        });
      }
    });

    it('should create AssetMaintenance', () => {
      cy.visit(assetMaintenancePageUrl + '/new');

      assetMaintenanceUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (assetMaintenanceSample.serviceRunningTime !== undefined && assetMaintenanceSample.serviceRunningTime !== null) {
        assetMaintenanceUpdatePage.setServiceRunningTimeInput(assetMaintenanceSample.serviceRunningTime);
      }
      if (
        assetMaintenanceSample.serviceRunningTimeMeasurement !== undefined &&
        assetMaintenanceSample.serviceRunningTimeMeasurement !== null
      ) {
        assetMaintenanceUpdatePage.setServiceRunningTimeMeasurementInput(assetMaintenanceSample.serviceRunningTimeMeasurement);
      }
      if (assetMaintenanceSample.restIntervalTime !== undefined && assetMaintenanceSample.restIntervalTime !== null) {
        assetMaintenanceUpdatePage.setRestIntervalTimeInput(assetMaintenanceSample.restIntervalTime);
      }
      if (assetMaintenanceSample.restIntervalTimeMeasurement !== undefined && assetMaintenanceSample.restIntervalTimeMeasurement !== null) {
        assetMaintenanceUpdatePage.setRestIntervalTimeMeasurementInput(assetMaintenanceSample.restIntervalTimeMeasurement);
      }
      if (assetMaintenanceSample.nextServiceDate !== undefined && assetMaintenanceSample.nextServiceDate !== null) {
        assetMaintenanceUpdatePage.setNextServiceDateInput(assetMaintenanceSample.nextServiceDate);
      }
      assetMaintenanceUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        assetMaintenance = body;
      });

      assetMaintenanceComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
