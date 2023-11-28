import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  AssetServiceHistoryComponentsPage,
  AssetServiceHistoryDetailPage,
  AssetServiceHistoryUpdatePage,
} from '../../../support/pages/entities/asset-service-history/asset-service-history.po';
import assetServiceHistorySample from './asset-service-history.json';

describe('AssetServiceHistory entity', () => {
  const COMPONENT_TITLE = 'Asset Service Histories';
  const SUBCOMPONENT_TITLE = 'Asset Service History';

  const assetServiceHistoryPageUrl = '/tabs/entities/asset-service-history';
  const assetServiceHistoryApiUrl = '/api/asset-service-histories';

  const assetServiceHistoryComponentsPage = new AssetServiceHistoryComponentsPage();
  const assetServiceHistoryUpdatePage = new AssetServiceHistoryUpdatePage();
  const assetServiceHistoryDetailPage = new AssetServiceHistoryDetailPage();

  let assetServiceHistory: any;

  beforeEach(() => {
    assetServiceHistory = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load AssetServiceHistories page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      assetServiceHistoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', assetServiceHistoryPageUrl);

      assetServiceHistoryComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create AssetServiceHistory page and go back', () => {
      cy.visit(assetServiceHistoryPageUrl);
      assetServiceHistoryComponentsPage.clickOnCreateButton();

      assetServiceHistoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      assetServiceHistoryUpdatePage.back();
      cy.url().should('include', assetServiceHistoryPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: assetServiceHistoryApiUrl,
        body: assetServiceHistorySample,
      }).then(({ body }) => {
        assetServiceHistory = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${assetServiceHistoryApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [assetServiceHistory],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (assetServiceHistory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetServiceHistoryApiUrl}/${assetServiceHistory.id}`,
        }).then(() => {
          assetServiceHistory = undefined;
        });
      }
    });

    it('should open AssetServiceHistory view, open AssetServiceHistory edit and go back', () => {
      cy.visit(assetServiceHistoryPageUrl);
      assetServiceHistoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetServiceHistoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (assetServiceHistory.serviceAmount !== undefined && assetServiceHistory.serviceAmount !== null) {
        assetServiceHistoryDetailPage.getServiceAmountContent().contains(assetServiceHistory.serviceAmount);
      }
      assetServiceHistoryDetailPage.edit();

      assetServiceHistoryUpdatePage.back();
      assetServiceHistoryDetailPage.back();
      cy.url().should('include', assetServiceHistoryPageUrl);
    });

    it('should open AssetServiceHistory view, open AssetServiceHistory edit and save', () => {
      cy.visit(assetServiceHistoryPageUrl);
      assetServiceHistoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetServiceHistoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      assetServiceHistoryDetailPage.edit();

      assetServiceHistoryUpdatePage.save();
      cy.url().should('include', assetServiceHistoryPageUrl);
    });

    it('should delete AssetServiceHistory', () => {
      cy.visit(assetServiceHistoryPageUrl);
      assetServiceHistoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetServiceHistoryDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      assetServiceHistoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      assetServiceHistory = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: assetServiceHistoryApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (assetServiceHistory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetServiceHistoryApiUrl}/${assetServiceHistory.id}`,
        }).then(() => {
          assetServiceHistory = undefined;
        });
      }
    });

    it('should create AssetServiceHistory', () => {
      cy.visit(assetServiceHistoryPageUrl + '/new');

      assetServiceHistoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (assetServiceHistorySample.serviceDate !== undefined && assetServiceHistorySample.serviceDate !== null) {
        assetServiceHistoryUpdatePage.setServiceDateInput(assetServiceHistorySample.serviceDate);
      }
      if (assetServiceHistorySample.isPaid !== undefined && assetServiceHistorySample.isPaid !== null) {
        assetServiceHistoryUpdatePage.setIsPaidInput(assetServiceHistorySample.isPaid);
      }
      if (assetServiceHistorySample.serviceAmount !== undefined && assetServiceHistorySample.serviceAmount !== null) {
        assetServiceHistoryUpdatePage.setServiceAmountInput(assetServiceHistorySample.serviceAmount);
      }
      assetServiceHistoryUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        assetServiceHistory = body;
      });

      assetServiceHistoryComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
