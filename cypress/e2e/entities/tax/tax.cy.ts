import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { TaxComponentsPage, TaxDetailPage, TaxUpdatePage } from '../../../support/pages/entities/tax/tax.po';
import taxSample from './tax.json';

describe('Tax entity', () => {
  const COMPONENT_TITLE = 'Taxes';
  const SUBCOMPONENT_TITLE = 'Tax';

  const taxPageUrl = '/tabs/entities/tax';
  const taxApiUrl = '/api/taxes';

  const taxComponentsPage = new TaxComponentsPage();
  const taxUpdatePage = new TaxUpdatePage();
  const taxDetailPage = new TaxDetailPage();

  let tax: any;

  beforeEach(() => {
    tax = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Taxes page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      taxComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', taxPageUrl);

      taxComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Tax page and go back', () => {
      cy.visit(taxPageUrl);
      taxComponentsPage.clickOnCreateButton();

      taxUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      taxUpdatePage.back();
      cy.url().should('include', taxPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: taxApiUrl,
        body: taxSample,
      }).then(({ body }) => {
        tax = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${taxApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [tax],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (tax) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${taxApiUrl}/${tax.id}`,
        }).then(() => {
          tax = undefined;
        });
      }
    });

    it('should open Tax view, open Tax edit and go back', () => {
      cy.visit(taxPageUrl);
      taxComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      taxDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (tax.name !== undefined && tax.name !== null) {
        taxDetailPage.getNameContent().contains(tax.name);
      }
      if (tax.percentage !== undefined && tax.percentage !== null) {
        taxDetailPage.getPercentageContent().contains(tax.percentage);
      }
      taxDetailPage.edit();

      taxUpdatePage.back();
      taxDetailPage.back();
      cy.url().should('include', taxPageUrl);
    });

    it('should open Tax view, open Tax edit and save', () => {
      cy.visit(taxPageUrl);
      taxComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      taxDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      taxDetailPage.edit();

      taxUpdatePage.save();
      cy.url().should('include', taxPageUrl);
    });

    it('should delete Tax', () => {
      cy.visit(taxPageUrl);
      taxComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      taxDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      taxComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      tax = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: taxApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (tax) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${taxApiUrl}/${tax.id}`,
        }).then(() => {
          tax = undefined;
        });
      }
    });

    it('should create Tax', () => {
      cy.visit(taxPageUrl + '/new');

      taxUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (taxSample.name !== undefined && taxSample.name !== null) {
        taxUpdatePage.setNameInput(taxSample.name);
      }
      if (taxSample.percentage !== undefined && taxSample.percentage !== null) {
        taxUpdatePage.setPercentageInput(taxSample.percentage);
      }
      if (taxSample.taxationAuthority !== undefined && taxSample.taxationAuthority !== null) {
        taxUpdatePage.setTaxationAuthorityInput(taxSample.taxationAuthority);
      }
      taxUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        tax = body;
      });

      taxComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
