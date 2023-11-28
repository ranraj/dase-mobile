import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  AssetCategoryComponentsPage,
  AssetCategoryDetailPage,
  AssetCategoryUpdatePage,
} from '../../../support/pages/entities/asset-category/asset-category.po';
import assetCategorySample from './asset-category.json';

describe('AssetCategory entity', () => {
  const COMPONENT_TITLE = 'Asset Categories';
  const SUBCOMPONENT_TITLE = 'Asset Category';

  const assetCategoryPageUrl = '/tabs/entities/asset-category';
  const assetCategoryApiUrl = '/api/asset-categories';

  const assetCategoryComponentsPage = new AssetCategoryComponentsPage();
  const assetCategoryUpdatePage = new AssetCategoryUpdatePage();
  const assetCategoryDetailPage = new AssetCategoryDetailPage();

  let assetCategory: any;

  beforeEach(() => {
    assetCategory = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load AssetCategories page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      assetCategoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', assetCategoryPageUrl);

      assetCategoryComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create AssetCategory page and go back', () => {
      cy.visit(assetCategoryPageUrl);
      assetCategoryComponentsPage.clickOnCreateButton();

      assetCategoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      assetCategoryUpdatePage.back();
      cy.url().should('include', assetCategoryPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: assetCategoryApiUrl,
        body: assetCategorySample,
      }).then(({ body }) => {
        assetCategory = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${assetCategoryApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [assetCategory],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (assetCategory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetCategoryApiUrl}/${assetCategory.id}`,
        }).then(() => {
          assetCategory = undefined;
        });
      }
    });

    it('should open AssetCategory view, open AssetCategory edit and go back', () => {
      cy.visit(assetCategoryPageUrl);
      assetCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetCategoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (assetCategory.name !== undefined && assetCategory.name !== null) {
        assetCategoryDetailPage.getNameContent().contains(assetCategory.name);
      }
      if (assetCategory.description !== undefined && assetCategory.description !== null) {
        assetCategoryDetailPage.getDescriptionContent().contains(assetCategory.description);
      }
      assetCategoryDetailPage.edit();

      assetCategoryUpdatePage.back();
      assetCategoryDetailPage.back();
      cy.url().should('include', assetCategoryPageUrl);
    });

    it('should open AssetCategory view, open AssetCategory edit and save', () => {
      cy.visit(assetCategoryPageUrl);
      assetCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetCategoryDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      assetCategoryDetailPage.edit();

      assetCategoryUpdatePage.save();
      cy.url().should('include', assetCategoryPageUrl);
    });

    it('should delete AssetCategory', () => {
      cy.visit(assetCategoryPageUrl);
      assetCategoryComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetCategoryDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      assetCategoryComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      assetCategory = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: assetCategoryApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (assetCategory) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetCategoryApiUrl}/${assetCategory.id}`,
        }).then(() => {
          assetCategory = undefined;
        });
      }
    });

    it('should create AssetCategory', () => {
      cy.visit(assetCategoryPageUrl + '/new');

      assetCategoryUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (assetCategorySample.name !== undefined && assetCategorySample.name !== null) {
        assetCategoryUpdatePage.setNameInput(assetCategorySample.name);
      }
      if (assetCategorySample.description !== undefined && assetCategorySample.description !== null) {
        assetCategoryUpdatePage.setDescriptionInput(assetCategorySample.description);
      }
      assetCategoryUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        assetCategory = body;
      });

      assetCategoryComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
