import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  ProductBrandingComponentsPage,
  ProductBrandingDetailPage,
  ProductBrandingUpdatePage,
} from '../../../support/pages/entities/product-branding/product-branding.po';
import productBrandingSample from './product-branding.json';

describe('ProductBranding entity', () => {
  const COMPONENT_TITLE = 'Product Brandings';
  const SUBCOMPONENT_TITLE = 'Product Branding';

  const productBrandingPageUrl = '/tabs/entities/product-branding';
  const productBrandingApiUrl = '/api/product-brandings';

  const productBrandingComponentsPage = new ProductBrandingComponentsPage();
  const productBrandingUpdatePage = new ProductBrandingUpdatePage();
  const productBrandingDetailPage = new ProductBrandingDetailPage();

  let productBranding: any;

  beforeEach(() => {
    productBranding = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ProductBrandings page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      productBrandingComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', productBrandingPageUrl);

      productBrandingComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ProductBranding page and go back', () => {
      cy.visit(productBrandingPageUrl);
      productBrandingComponentsPage.clickOnCreateButton();

      productBrandingUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      productBrandingUpdatePage.back();
      cy.url().should('include', productBrandingPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: productBrandingApiUrl,
        body: productBrandingSample,
      }).then(({ body }) => {
        productBranding = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${productBrandingApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [productBranding],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (productBranding) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productBrandingApiUrl}/${productBranding.id}`,
        }).then(() => {
          productBranding = undefined;
        });
      }
    });

    it('should open ProductBranding view, open ProductBranding edit and go back', () => {
      cy.visit(productBrandingPageUrl);
      productBrandingComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productBrandingDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (productBranding.name !== undefined && productBranding.name !== null) {
        productBrandingDetailPage.getNameContent().contains(productBranding.name);
      }
      if (productBranding.description !== undefined && productBranding.description !== null) {
        productBrandingDetailPage.getDescriptionContent().contains(productBranding.description);
      }
      if (productBranding.price !== undefined && productBranding.price !== null) {
        productBrandingDetailPage.getPriceContent().contains(productBranding.price);
      }
      if (productBranding.imageSrc !== undefined && productBranding.imageSrc !== null) {
        productBrandingDetailPage.getImageSrcContent().contains(productBranding.imageSrc);
      }
      if (productBranding.discountAmount !== undefined && productBranding.discountAmount !== null) {
        productBrandingDetailPage.getDiscountAmountContent().contains(productBranding.discountAmount);
      }
      if (productBranding.discountPercentage !== undefined && productBranding.discountPercentage !== null) {
        productBrandingDetailPage.getDiscountPercentageContent().contains(productBranding.discountPercentage);
      }
      productBrandingDetailPage.edit();

      productBrandingUpdatePage.back();
      productBrandingDetailPage.back();
      cy.url().should('include', productBrandingPageUrl);
    });

    it('should open ProductBranding view, open ProductBranding edit and save', () => {
      cy.visit(productBrandingPageUrl);
      productBrandingComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productBrandingDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      productBrandingDetailPage.edit();

      productBrandingUpdatePage.save();
      cy.url().should('include', productBrandingPageUrl);
    });

    it('should delete ProductBranding', () => {
      cy.visit(productBrandingPageUrl);
      productBrandingComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productBrandingDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      productBrandingComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      productBranding = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: productBrandingApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (productBranding) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productBrandingApiUrl}/${productBranding.id}`,
        }).then(() => {
          productBranding = undefined;
        });
      }
    });

    it('should create ProductBranding', () => {
      cy.visit(productBrandingPageUrl + '/new');

      productBrandingUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (productBrandingSample.name !== undefined && productBrandingSample.name !== null) {
        productBrandingUpdatePage.setNameInput(productBrandingSample.name);
      }
      if (productBrandingSample.description !== undefined && productBrandingSample.description !== null) {
        productBrandingUpdatePage.setDescriptionInput(productBrandingSample.description);
      }
      if (productBrandingSample.price !== undefined && productBrandingSample.price !== null) {
        productBrandingUpdatePage.setPriceInput(productBrandingSample.price);
      }
      if (productBrandingSample.imageSrc !== undefined && productBrandingSample.imageSrc !== null) {
        productBrandingUpdatePage.setImageSrcInput(productBrandingSample.imageSrc);
      }
      if (productBrandingSample.measurement !== undefined && productBrandingSample.measurement !== null) {
        productBrandingUpdatePage.setMeasurementInput(productBrandingSample.measurement);
      }
      if (productBrandingSample.measurementUnit !== undefined && productBrandingSample.measurementUnit !== null) {
        productBrandingUpdatePage.setMeasurementUnitInput(productBrandingSample.measurementUnit);
      }
      if (productBrandingSample.discountAmount !== undefined && productBrandingSample.discountAmount !== null) {
        productBrandingUpdatePage.setDiscountAmountInput(productBrandingSample.discountAmount);
      }
      if (productBrandingSample.discountPercentage !== undefined && productBrandingSample.discountPercentage !== null) {
        productBrandingUpdatePage.setDiscountPercentageInput(productBrandingSample.discountPercentage);
      }
      productBrandingUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        productBranding = body;
      });

      productBrandingComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
