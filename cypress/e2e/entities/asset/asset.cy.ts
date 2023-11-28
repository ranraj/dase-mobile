import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { AssetComponentsPage, AssetDetailPage, AssetUpdatePage } from '../../../support/pages/entities/asset/asset.po';
import assetSample from './asset.json';

describe('Asset entity', () => {
  const COMPONENT_TITLE = 'Assets';
  const SUBCOMPONENT_TITLE = 'Asset';

  const assetPageUrl = '/tabs/entities/asset';
  const assetApiUrl = '/api/assets';

  const assetComponentsPage = new AssetComponentsPage();
  const assetUpdatePage = new AssetUpdatePage();
  const assetDetailPage = new AssetDetailPage();

  let asset: any;

  beforeEach(() => {
    asset = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Assets page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      assetComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', assetPageUrl);

      assetComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Asset page and go back', () => {
      cy.visit(assetPageUrl);
      assetComponentsPage.clickOnCreateButton();

      assetUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      assetUpdatePage.back();
      cy.url().should('include', assetPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: assetApiUrl,
        body: assetSample,
      }).then(({ body }) => {
        asset = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${assetApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [asset],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (asset) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetApiUrl}/${asset.id}`,
        }).then(() => {
          asset = undefined;
        });
      }
    });

    it('should open Asset view, open Asset edit and go back', () => {
      cy.visit(assetPageUrl);
      assetComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (asset.name !== undefined && asset.name !== null) {
        assetDetailPage.getNameContent().contains(asset.name);
      }
      if (asset.code !== undefined && asset.code !== null) {
        assetDetailPage.getCodeContent().contains(asset.code);
      }
      if (asset.maxCapacity !== undefined && asset.maxCapacity !== null) {
        assetDetailPage.getMaxCapacityContent().contains(asset.maxCapacity);
      }
      if (asset.maxRunningTime !== undefined && asset.maxRunningTime !== null) {
        assetDetailPage.getMaxRunningTimeContent().contains(asset.maxRunningTime);
      }
      assetDetailPage.edit();

      assetUpdatePage.back();
      assetDetailPage.back();
      cy.url().should('include', assetPageUrl);
    });

    it('should open Asset view, open Asset edit and save', () => {
      cy.visit(assetPageUrl);
      assetComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      assetDetailPage.edit();

      assetUpdatePage.save();
      cy.url().should('include', assetPageUrl);
    });

    it('should delete Asset', () => {
      cy.visit(assetPageUrl);
      assetComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      assetComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      asset = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: assetApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (asset) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetApiUrl}/${asset.id}`,
        }).then(() => {
          asset = undefined;
        });
      }
    });

    it('should create Asset', () => {
      cy.visit(assetPageUrl + '/new');

      assetUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (assetSample.name !== undefined && assetSample.name !== null) {
        assetUpdatePage.setNameInput(assetSample.name);
      }
      if (assetSample.code !== undefined && assetSample.code !== null) {
        assetUpdatePage.setCodeInput(assetSample.code);
      }
      if (assetSample.assetType !== undefined && assetSample.assetType !== null) {
        assetUpdatePage.setAssetTypeInput(assetSample.assetType);
      }
      if (assetSample.assetOwnership !== undefined && assetSample.assetOwnership !== null) {
        assetUpdatePage.setAssetOwnershipInput(assetSample.assetOwnership);
      }
      if (assetSample.isEmpty !== undefined && assetSample.isEmpty !== null) {
        assetUpdatePage.setIsEmptyInput(assetSample.isEmpty);
      }
      if (assetSample.maxCapacity !== undefined && assetSample.maxCapacity !== null) {
        assetUpdatePage.setMaxCapacityInput(assetSample.maxCapacity);
      }
      if (assetSample.maxCapacityMeasurement !== undefined && assetSample.maxCapacityMeasurement !== null) {
        assetUpdatePage.setMaxCapacityMeasurementInput(assetSample.maxCapacityMeasurement);
      }
      if (assetSample.maxRunningTime !== undefined && assetSample.maxRunningTime !== null) {
        assetUpdatePage.setMaxRunningTimeInput(assetSample.maxRunningTime);
      }
      if (assetSample.maxRunningTimeMeasurement !== undefined && assetSample.maxRunningTimeMeasurement !== null) {
        assetUpdatePage.setMaxRunningTimeMeasurementInput(assetSample.maxRunningTimeMeasurement);
      }
      assetUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        asset = body;
      });

      assetComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
