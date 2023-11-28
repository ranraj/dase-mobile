import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  AssetItemComponentsPage,
  AssetItemDetailPage,
  AssetItemUpdatePage,
} from '../../../support/pages/entities/asset-item/asset-item.po';
import assetItemSample from './asset-item.json';

describe('AssetItem entity', () => {
  const COMPONENT_TITLE = 'Asset Items';
  const SUBCOMPONENT_TITLE = 'Asset Item';

  const assetItemPageUrl = '/tabs/entities/asset-item';
  const assetItemApiUrl = '/api/asset-items';

  const assetItemComponentsPage = new AssetItemComponentsPage();
  const assetItemUpdatePage = new AssetItemUpdatePage();
  const assetItemDetailPage = new AssetItemDetailPage();

  let assetItem: any;

  beforeEach(() => {
    assetItem = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load AssetItems page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      assetItemComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', assetItemPageUrl);

      assetItemComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create AssetItem page and go back', () => {
      cy.visit(assetItemPageUrl);
      assetItemComponentsPage.clickOnCreateButton();

      assetItemUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      assetItemUpdatePage.back();
      cy.url().should('include', assetItemPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: assetItemApiUrl,
        body: assetItemSample,
      }).then(({ body }) => {
        assetItem = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${assetItemApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [assetItem],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (assetItem) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetItemApiUrl}/${assetItem.id}`,
        }).then(() => {
          assetItem = undefined;
        });
      }
    });

    it('should open AssetItem view, open AssetItem edit and go back', () => {
      cy.visit(assetItemPageUrl);
      assetItemComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetItemDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (assetItem.name !== undefined && assetItem.name !== null) {
        assetItemDetailPage.getNameContent().contains(assetItem.name);
      }
      if (assetItem.weight !== undefined && assetItem.weight !== null) {
        assetItemDetailPage.getWeightContent().contains(assetItem.weight);
      }
      assetItemDetailPage.edit();

      assetItemUpdatePage.back();
      assetItemDetailPage.back();
      cy.url().should('include', assetItemPageUrl);
    });

    it('should open AssetItem view, open AssetItem edit and save', () => {
      cy.visit(assetItemPageUrl);
      assetItemComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetItemDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      assetItemDetailPage.edit();

      assetItemUpdatePage.save();
      cy.url().should('include', assetItemPageUrl);
    });

    it('should delete AssetItem', () => {
      cy.visit(assetItemPageUrl);
      assetItemComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetItemDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      assetItemComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      assetItem = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: assetItemApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (assetItem) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetItemApiUrl}/${assetItem.id}`,
        }).then(() => {
          assetItem = undefined;
        });
      }
    });

    it('should create AssetItem', () => {
      cy.visit(assetItemPageUrl + '/new');

      assetItemUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (assetItemSample.name !== undefined && assetItemSample.name !== null) {
        assetItemUpdatePage.setNameInput(assetItemSample.name);
      }
      if (assetItemSample.assetItemCapacity !== undefined && assetItemSample.assetItemCapacity !== null) {
        assetItemUpdatePage.setAssetItemCapacityInput(assetItemSample.assetItemCapacity);
      }
      if (assetItemSample.weight !== undefined && assetItemSample.weight !== null) {
        assetItemUpdatePage.setWeightInput(assetItemSample.weight);
      }
      assetItemUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        assetItem = body;
      });

      assetItemComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
