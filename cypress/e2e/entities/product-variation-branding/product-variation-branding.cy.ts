import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  ProductVariationBrandingComponentsPage,
  ProductVariationBrandingDetailPage,
  ProductVariationBrandingUpdatePage,
} from '../../../support/pages/entities/product-variation-branding/product-variation-branding.po';
import productVariationBrandingSample from './product-variation-branding.json';

describe('ProductVariationBranding entity', () => {
  const COMPONENT_TITLE = 'Product Variation Brandings';
  const SUBCOMPONENT_TITLE = 'Product Variation Branding';

  const productVariationBrandingPageUrl = '/tabs/entities/product-variation-branding';
  const productVariationBrandingApiUrl = '/api/product-variation-brandings';

  const productVariationBrandingComponentsPage = new ProductVariationBrandingComponentsPage();
  const productVariationBrandingUpdatePage = new ProductVariationBrandingUpdatePage();
  const productVariationBrandingDetailPage = new ProductVariationBrandingDetailPage();

  let productVariationBranding: any;

  beforeEach(() => {
    productVariationBranding = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ProductVariationBrandings page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      productVariationBrandingComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', productVariationBrandingPageUrl);

      productVariationBrandingComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ProductVariationBranding page and go back', () => {
      cy.visit(productVariationBrandingPageUrl);
      productVariationBrandingComponentsPage.clickOnCreateButton();

      productVariationBrandingUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      productVariationBrandingUpdatePage.back();
      cy.url().should('include', productVariationBrandingPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: productVariationBrandingApiUrl,
        body: productVariationBrandingSample,
      }).then(({ body }) => {
        productVariationBranding = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${productVariationBrandingApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [productVariationBranding],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (productVariationBranding) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productVariationBrandingApiUrl}/${productVariationBranding.id}`,
        }).then(() => {
          productVariationBranding = undefined;
        });
      }
    });

    it('should open ProductVariationBranding view, open ProductVariationBranding edit and go back', () => {
      cy.visit(productVariationBrandingPageUrl);
      productVariationBrandingComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productVariationBrandingDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (productVariationBranding.name !== undefined && productVariationBranding.name !== null) {
        productVariationBrandingDetailPage.getNameContent().contains(productVariationBranding.name);
      }
      if (productVariationBranding.description !== undefined && productVariationBranding.description !== null) {
        productVariationBrandingDetailPage.getDescriptionContent().contains(productVariationBranding.description);
      }
      if (productVariationBranding.price !== undefined && productVariationBranding.price !== null) {
        productVariationBrandingDetailPage.getPriceContent().contains(productVariationBranding.price);
      }
      if (productVariationBranding.imageSrc !== undefined && productVariationBranding.imageSrc !== null) {
        productVariationBrandingDetailPage.getImageSrcContent().contains(productVariationBranding.imageSrc);
      }
      if (productVariationBranding.discountAmount !== undefined && productVariationBranding.discountAmount !== null) {
        productVariationBrandingDetailPage.getDiscountAmountContent().contains(productVariationBranding.discountAmount);
      }
      if (productVariationBranding.discountPercentage !== undefined && productVariationBranding.discountPercentage !== null) {
        productVariationBrandingDetailPage.getDiscountPercentageContent().contains(productVariationBranding.discountPercentage);
      }
      productVariationBrandingDetailPage.edit();

      productVariationBrandingUpdatePage.back();
      productVariationBrandingDetailPage.back();
      cy.url().should('include', productVariationBrandingPageUrl);
    });

    it('should open ProductVariationBranding view, open ProductVariationBranding edit and save', () => {
      cy.visit(productVariationBrandingPageUrl);
      productVariationBrandingComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productVariationBrandingDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      productVariationBrandingDetailPage.edit();

      productVariationBrandingUpdatePage.save();
      cy.url().should('include', productVariationBrandingPageUrl);
    });

    it('should delete ProductVariationBranding', () => {
      cy.visit(productVariationBrandingPageUrl);
      productVariationBrandingComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productVariationBrandingDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      productVariationBrandingComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      productVariationBranding = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: productVariationBrandingApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (productVariationBranding) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productVariationBrandingApiUrl}/${productVariationBranding.id}`,
        }).then(() => {
          productVariationBranding = undefined;
        });
      }
    });

    it('should create ProductVariationBranding', () => {
      cy.visit(productVariationBrandingPageUrl + '/new');

      productVariationBrandingUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (productVariationBrandingSample.name !== undefined && productVariationBrandingSample.name !== null) {
        productVariationBrandingUpdatePage.setNameInput(productVariationBrandingSample.name);
      }
      if (productVariationBrandingSample.description !== undefined && productVariationBrandingSample.description !== null) {
        productVariationBrandingUpdatePage.setDescriptionInput(productVariationBrandingSample.description);
      }
      if (productVariationBrandingSample.price !== undefined && productVariationBrandingSample.price !== null) {
        productVariationBrandingUpdatePage.setPriceInput(productVariationBrandingSample.price);
      }
      if (productVariationBrandingSample.imageSrc !== undefined && productVariationBrandingSample.imageSrc !== null) {
        productVariationBrandingUpdatePage.setImageSrcInput(productVariationBrandingSample.imageSrc);
      }
      if (productVariationBrandingSample.measurement !== undefined && productVariationBrandingSample.measurement !== null) {
        productVariationBrandingUpdatePage.setMeasurementInput(productVariationBrandingSample.measurement);
      }
      if (productVariationBrandingSample.measurementUnit !== undefined && productVariationBrandingSample.measurementUnit !== null) {
        productVariationBrandingUpdatePage.setMeasurementUnitInput(productVariationBrandingSample.measurementUnit);
      }
      if (productVariationBrandingSample.discountAmount !== undefined && productVariationBrandingSample.discountAmount !== null) {
        productVariationBrandingUpdatePage.setDiscountAmountInput(productVariationBrandingSample.discountAmount);
      }
      if (productVariationBrandingSample.discountPercentage !== undefined && productVariationBrandingSample.discountPercentage !== null) {
        productVariationBrandingUpdatePage.setDiscountPercentageInput(productVariationBrandingSample.discountPercentage);
      }
      productVariationBrandingUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        productVariationBranding = body;
      });

      productVariationBrandingComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
