import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  AssetPurchaseComponentsPage,
  AssetPurchaseDetailPage,
  AssetPurchaseUpdatePage,
} from '../../../support/pages/entities/asset-purchase/asset-purchase.po';
import assetPurchaseSample from './asset-purchase.json';

describe('AssetPurchase entity', () => {
  const COMPONENT_TITLE = 'Asset Purchases';
  const SUBCOMPONENT_TITLE = 'Asset Purchase';

  const assetPurchasePageUrl = '/tabs/entities/asset-purchase';
  const assetPurchaseApiUrl = '/api/asset-purchases';

  const assetPurchaseComponentsPage = new AssetPurchaseComponentsPage();
  const assetPurchaseUpdatePage = new AssetPurchaseUpdatePage();
  const assetPurchaseDetailPage = new AssetPurchaseDetailPage();

  let assetPurchase: any;

  beforeEach(() => {
    assetPurchase = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load AssetPurchases page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      assetPurchaseComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', assetPurchasePageUrl);

      assetPurchaseComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create AssetPurchase page and go back', () => {
      cy.visit(assetPurchasePageUrl);
      assetPurchaseComponentsPage.clickOnCreateButton();

      assetPurchaseUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      assetPurchaseUpdatePage.back();
      cy.url().should('include', assetPurchasePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: assetPurchaseApiUrl,
        body: assetPurchaseSample,
      }).then(({ body }) => {
        assetPurchase = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${assetPurchaseApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [assetPurchase],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (assetPurchase) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetPurchaseApiUrl}/${assetPurchase.id}`,
        }).then(() => {
          assetPurchase = undefined;
        });
      }
    });

    it('should open AssetPurchase view, open AssetPurchase edit and go back', () => {
      cy.visit(assetPurchasePageUrl);
      assetPurchaseComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetPurchaseDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (assetPurchase.amount !== undefined && assetPurchase.amount !== null) {
        assetPurchaseDetailPage.getAmountContent().contains(assetPurchase.amount);
      }
      if (assetPurchase.paymentReference !== undefined && assetPurchase.paymentReference !== null) {
        assetPurchaseDetailPage.getPaymentReferenceContent().contains(assetPurchase.paymentReference);
      }
      assetPurchaseDetailPage.edit();

      assetPurchaseUpdatePage.back();
      assetPurchaseDetailPage.back();
      cy.url().should('include', assetPurchasePageUrl);
    });

    it('should open AssetPurchase view, open AssetPurchase edit and save', () => {
      cy.visit(assetPurchasePageUrl);
      assetPurchaseComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetPurchaseDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      assetPurchaseDetailPage.edit();

      assetPurchaseUpdatePage.save();
      cy.url().should('include', assetPurchasePageUrl);
    });

    it('should delete AssetPurchase', () => {
      cy.visit(assetPurchasePageUrl);
      assetPurchaseComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      assetPurchaseDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      assetPurchaseComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      assetPurchase = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: assetPurchaseApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (assetPurchase) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${assetPurchaseApiUrl}/${assetPurchase.id}`,
        }).then(() => {
          assetPurchase = undefined;
        });
      }
    });

    it('should create AssetPurchase', () => {
      cy.visit(assetPurchasePageUrl + '/new');

      assetPurchaseUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (assetPurchaseSample.purchaseDate !== undefined && assetPurchaseSample.purchaseDate !== null) {
        assetPurchaseUpdatePage.setPurchaseDateInput(assetPurchaseSample.purchaseDate);
      }
      if (assetPurchaseSample.amount !== undefined && assetPurchaseSample.amount !== null) {
        assetPurchaseUpdatePage.setAmountInput(assetPurchaseSample.amount);
      }
      if (assetPurchaseSample.paymentDate !== undefined && assetPurchaseSample.paymentDate !== null) {
        assetPurchaseUpdatePage.setPaymentDateInput(assetPurchaseSample.paymentDate);
      }
      if (assetPurchaseSample.paymentMethod !== undefined && assetPurchaseSample.paymentMethod !== null) {
        assetPurchaseUpdatePage.setPaymentMethodInput(assetPurchaseSample.paymentMethod);
      }
      if (assetPurchaseSample.paymentReference !== undefined && assetPurchaseSample.paymentReference !== null) {
        assetPurchaseUpdatePage.setPaymentReferenceInput(assetPurchaseSample.paymentReference);
      }
      if (assetPurchaseSample.paymentStatus !== undefined && assetPurchaseSample.paymentStatus !== null) {
        assetPurchaseUpdatePage.setPaymentStatusInput(assetPurchaseSample.paymentStatus);
      }
      assetPurchaseUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        assetPurchase = body;
      });

      assetPurchaseComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
