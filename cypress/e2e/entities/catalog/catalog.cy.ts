import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { CatalogComponentsPage, CatalogDetailPage, CatalogUpdatePage } from '../../../support/pages/entities/catalog/catalog.po';
import catalogSample from './catalog.json';

describe('Catalog entity', () => {
  const COMPONENT_TITLE = 'Catalogs';
  const SUBCOMPONENT_TITLE = 'Catalog';

  const catalogPageUrl = '/tabs/entities/catalog';
  const catalogApiUrl = '/api/catalogs';

  const catalogComponentsPage = new CatalogComponentsPage();
  const catalogUpdatePage = new CatalogUpdatePage();
  const catalogDetailPage = new CatalogDetailPage();

  let catalog: any;

  beforeEach(() => {
    catalog = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Catalogs page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      catalogComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', catalogPageUrl);

      catalogComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Catalog page and go back', () => {
      cy.visit(catalogPageUrl);
      catalogComponentsPage.clickOnCreateButton();

      catalogUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      catalogUpdatePage.back();
      cy.url().should('include', catalogPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: catalogApiUrl,
        body: catalogSample,
      }).then(({ body }) => {
        catalog = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${catalogApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [catalog],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (catalog) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${catalogApiUrl}/${catalog.id}`,
        }).then(() => {
          catalog = undefined;
        });
      }
    });

    it('should open Catalog view, open Catalog edit and go back', () => {
      cy.visit(catalogPageUrl);
      catalogComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      catalogDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (catalog.name !== undefined && catalog.name !== null) {
        catalogDetailPage.getNameContent().contains(catalog.name);
      }
      catalogDetailPage.edit();

      catalogUpdatePage.back();
      catalogDetailPage.back();
      cy.url().should('include', catalogPageUrl);
    });

    it('should open Catalog view, open Catalog edit and save', () => {
      cy.visit(catalogPageUrl);
      catalogComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      catalogDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      catalogDetailPage.edit();

      catalogUpdatePage.save();
      cy.url().should('include', catalogPageUrl);
    });

    it('should delete Catalog', () => {
      cy.visit(catalogPageUrl);
      catalogComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      catalogDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      catalogComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      catalog = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: catalogApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (catalog) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${catalogApiUrl}/${catalog.id}`,
        }).then(() => {
          catalog = undefined;
        });
      }
    });

    it('should create Catalog', () => {
      cy.visit(catalogPageUrl + '/new');

      catalogUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (catalogSample.name !== undefined && catalogSample.name !== null) {
        catalogUpdatePage.setNameInput(catalogSample.name);
      }
      if (catalogSample.active !== undefined && catalogSample.active !== null) {
        catalogUpdatePage.setActiveInput(catalogSample.active);
      }
      if (catalogSample.activeOn !== undefined && catalogSample.activeOn !== null) {
        catalogUpdatePage.setActiveOnInput(catalogSample.activeOn);
      }
      if (catalogSample.createdDate !== undefined && catalogSample.createdDate !== null) {
        catalogUpdatePage.setCreatedDateInput(catalogSample.createdDate);
      }
      catalogUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        catalog = body;
      });

      catalogComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
