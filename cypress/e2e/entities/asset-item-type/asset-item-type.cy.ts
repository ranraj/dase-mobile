import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  AssetItemTypeComponentsPage,
  AssetItemTypeDetailPage,
  AssetItemTypeUpdatePage,
} from '../../../support/pages/entities/asset-item-type/asset-item-type.po';
import assetItemTypeSample from './asset-item-type.json';

describe('AssetItemType entity', () => {
  const COMPONENT_TITLE = 'Asset Item Types';
  const SUBCOMPONENT_TITLE = 'Asset Item Type';

  const assetItemTypePageUrl = '/tabs/entities/asset-item-type';
  const assetItemTypeApiUrl = '/api/asset-item-types';

  const assetItemTypeComponentsPage = new AssetItemTypeComponentsPage();
  const assetItemTypeUpdatePage = new AssetItemTypeUpdatePage();
  const assetItemTypeDetailPage = new AssetItemTypeDetailPage();

  let assetItemType: any;

  beforeEach(() => {
    assetItemType = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load AssetItemTypes page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      assetItemTypeComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', assetItemTypePageUrl);

      assetItemTypeComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create AssetItemType page and go back', () => {
      cy.visit(assetItemTypePageUrl);
      assetItemTypeComponentsPage.clickOnCreateButton();

      assetItemTypeUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      assetItemTypeUpdatePage.back();
      cy.url().should('include', assetItemTypePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: assetItemTypeApiUrl,
        body: assetItemTypeSample,
      }).then(({ body }) => {
        assetItemType = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${assetItemTypeApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [assetItemType],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (assetItemType) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetItemTypeApiUrl}/${assetItemType.id}`,
        }).then(() => {
          assetItemType = undefined;
        });
      }
    });

    it('should open AssetItemType view, open AssetItemType edit and go back', () => {
      cy.visit(assetItemTypePageUrl);
      assetItemTypeComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetItemTypeDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (assetItemType.name !== undefined && assetItemType.name !== null) {
        assetItemTypeDetailPage.getNameContent().contains(assetItemType.name);
      }
      if (assetItemType.code !== undefined && assetItemType.code !== null) {
        assetItemTypeDetailPage.getCodeContent().contains(assetItemType.code);
      }
      assetItemTypeDetailPage.edit();

      assetItemTypeUpdatePage.back();
      assetItemTypeDetailPage.back();
      cy.url().should('include', assetItemTypePageUrl);
    });

    it('should open AssetItemType view, open AssetItemType edit and save', () => {
      cy.visit(assetItemTypePageUrl);
      assetItemTypeComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetItemTypeDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      assetItemTypeDetailPage.edit();

      assetItemTypeUpdatePage.save();
      cy.url().should('include', assetItemTypePageUrl);
    });

    it('should delete AssetItemType', () => {
      cy.visit(assetItemTypePageUrl);
      assetItemTypeComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetItemTypeDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      assetItemTypeComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      assetItemType = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: assetItemTypeApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (assetItemType) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetItemTypeApiUrl}/${assetItemType.id}`,
        }).then(() => {
          assetItemType = undefined;
        });
      }
    });

    it('should create AssetItemType', () => {
      cy.visit(assetItemTypePageUrl + '/new');

      assetItemTypeUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (assetItemTypeSample.name !== undefined && assetItemTypeSample.name !== null) {
        assetItemTypeUpdatePage.setNameInput(assetItemTypeSample.name);
      }
      if (assetItemTypeSample.code !== undefined && assetItemTypeSample.code !== null) {
        assetItemTypeUpdatePage.setCodeInput(assetItemTypeSample.code);
      }
      assetItemTypeUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        assetItemType = body;
      });

      assetItemTypeComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
