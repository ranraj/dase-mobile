import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { TaxSplitComponentsPage, TaxSplitDetailPage, TaxSplitUpdatePage } from '../../../support/pages/entities/tax-split/tax-split.po';
import taxSplitSample from './tax-split.json';

describe('TaxSplit entity', () => {
  const COMPONENT_TITLE = 'Tax Splits';
  const SUBCOMPONENT_TITLE = 'Tax Split';

  const taxSplitPageUrl = '/tabs/entities/tax-split';
  const taxSplitApiUrl = '/api/tax-splits';

  const taxSplitComponentsPage = new TaxSplitComponentsPage();
  const taxSplitUpdatePage = new TaxSplitUpdatePage();
  const taxSplitDetailPage = new TaxSplitDetailPage();

  let taxSplit: any;

  beforeEach(() => {
    taxSplit = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load TaxSplits page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      taxSplitComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', taxSplitPageUrl);

      taxSplitComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create TaxSplit page and go back', () => {
      cy.visit(taxSplitPageUrl);
      taxSplitComponentsPage.clickOnCreateButton();

      taxSplitUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      taxSplitUpdatePage.back();
      cy.url().should('include', taxSplitPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: taxSplitApiUrl,
        body: taxSplitSample,
      }).then(({ body }) => {
        taxSplit = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${taxSplitApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [taxSplit],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (taxSplit) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${taxSplitApiUrl}/${taxSplit.id}`,
        }).then(() => {
          taxSplit = undefined;
        });
      }
    });

    it('should open TaxSplit view, open TaxSplit edit and go back', () => {
      cy.visit(taxSplitPageUrl);
      taxSplitComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      taxSplitDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (taxSplit.name !== undefined && taxSplit.name !== null) {
        taxSplitDetailPage.getNameContent().contains(taxSplit.name);
      }
      if (taxSplit.percentage !== undefined && taxSplit.percentage !== null) {
        taxSplitDetailPage.getPercentageContent().contains(taxSplit.percentage);
      }
      taxSplitDetailPage.edit();

      taxSplitUpdatePage.back();
      taxSplitDetailPage.back();
      cy.url().should('include', taxSplitPageUrl);
    });

    it('should open TaxSplit view, open TaxSplit edit and save', () => {
      cy.visit(taxSplitPageUrl);
      taxSplitComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      taxSplitDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      taxSplitDetailPage.edit();

      taxSplitUpdatePage.save();
      cy.url().should('include', taxSplitPageUrl);
    });

    it('should delete TaxSplit', () => {
      cy.visit(taxSplitPageUrl);
      taxSplitComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      taxSplitDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      taxSplitComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      taxSplit = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: taxSplitApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (taxSplit) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${taxSplitApiUrl}/${taxSplit.id}`,
        }).then(() => {
          taxSplit = undefined;
        });
      }
    });

    it('should create TaxSplit', () => {
      cy.visit(taxSplitPageUrl + '/new');

      taxSplitUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (taxSplitSample.name !== undefined && taxSplitSample.name !== null) {
        taxSplitUpdatePage.setNameInput(taxSplitSample.name);
      }
      if (taxSplitSample.percentage !== undefined && taxSplitSample.percentage !== null) {
        taxSplitUpdatePage.setPercentageInput(taxSplitSample.percentage);
      }
      taxSplitUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        taxSplit = body;
      });

      taxSplitComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
