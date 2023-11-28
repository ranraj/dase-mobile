import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  ProductVariationComponentsPage,
  ProductVariationDetailPage,
  ProductVariationUpdatePage,
} from '../../../support/pages/entities/product-variation/product-variation.po';
import productVariationSample from './product-variation.json';

describe('ProductVariation entity', () => {
  const COMPONENT_TITLE = 'Product Variations';
  const SUBCOMPONENT_TITLE = 'Product Variation';

  const productVariationPageUrl = '/tabs/entities/product-variation';
  const productVariationApiUrl = '/api/product-variations';

  const productVariationComponentsPage = new ProductVariationComponentsPage();
  const productVariationUpdatePage = new ProductVariationUpdatePage();
  const productVariationDetailPage = new ProductVariationDetailPage();

  let productVariation: any;

  beforeEach(() => {
    productVariation = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ProductVariations page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      productVariationComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', productVariationPageUrl);

      productVariationComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ProductVariation page and go back', () => {
      cy.visit(productVariationPageUrl);
      productVariationComponentsPage.clickOnCreateButton();

      productVariationUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      productVariationUpdatePage.back();
      cy.url().should('include', productVariationPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: productVariationApiUrl,
        body: productVariationSample,
      }).then(({ body }) => {
        productVariation = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${productVariationApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [productVariation],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (productVariation) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productVariationApiUrl}/${productVariation.id}`,
        }).then(() => {
          productVariation = undefined;
        });
      }
    });

    it('should open ProductVariation view, open ProductVariation edit and go back', () => {
      cy.visit(productVariationPageUrl);
      productVariationComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productVariationDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (productVariation.name !== undefined && productVariation.name !== null) {
        productVariationDetailPage.getNameContent().contains(productVariation.name);
      }
      if (productVariation.description !== undefined && productVariation.description !== null) {
        productVariationDetailPage.getDescriptionContent().contains(productVariation.description);
      }
      if (productVariation.price !== undefined && productVariation.price !== null) {
        productVariationDetailPage.getPriceContent().contains(productVariation.price);
      }
      if (productVariation.imageSrc !== undefined && productVariation.imageSrc !== null) {
        productVariationDetailPage.getImageSrcContent().contains(productVariation.imageSrc);
      }
      if (productVariation.discountAmount !== undefined && productVariation.discountAmount !== null) {
        productVariationDetailPage.getDiscountAmountContent().contains(productVariation.discountAmount);
      }
      if (productVariation.discountPercentage !== undefined && productVariation.discountPercentage !== null) {
        productVariationDetailPage.getDiscountPercentageContent().contains(productVariation.discountPercentage);
      }
      productVariationDetailPage.edit();

      productVariationUpdatePage.back();
      productVariationDetailPage.back();
      cy.url().should('include', productVariationPageUrl);
    });

    it('should open ProductVariation view, open ProductVariation edit and save', () => {
      cy.visit(productVariationPageUrl);
      productVariationComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productVariationDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      productVariationDetailPage.edit();

      productVariationUpdatePage.save();
      cy.url().should('include', productVariationPageUrl);
    });

    it('should delete ProductVariation', () => {
      cy.visit(productVariationPageUrl);
      productVariationComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productVariationDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      productVariationComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      productVariation = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: productVariationApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (productVariation) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productVariationApiUrl}/${productVariation.id}`,
        }).then(() => {
          productVariation = undefined;
        });
      }
    });

    it('should create ProductVariation', () => {
      cy.visit(productVariationPageUrl + '/new');

      productVariationUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (productVariationSample.name !== undefined && productVariationSample.name !== null) {
        productVariationUpdatePage.setNameInput(productVariationSample.name);
      }
      if (productVariationSample.description !== undefined && productVariationSample.description !== null) {
        productVariationUpdatePage.setDescriptionInput(productVariationSample.description);
      }
      if (productVariationSample.price !== undefined && productVariationSample.price !== null) {
        productVariationUpdatePage.setPriceInput(productVariationSample.price);
      }
      if (productVariationSample.imageSrc !== undefined && productVariationSample.imageSrc !== null) {
        productVariationUpdatePage.setImageSrcInput(productVariationSample.imageSrc);
      }
      if (productVariationSample.measurement !== undefined && productVariationSample.measurement !== null) {
        productVariationUpdatePage.setMeasurementInput(productVariationSample.measurement);
      }
      if (productVariationSample.measurementUnit !== undefined && productVariationSample.measurementUnit !== null) {
        productVariationUpdatePage.setMeasurementUnitInput(productVariationSample.measurementUnit);
      }
      if (productVariationSample.discountAmount !== undefined && productVariationSample.discountAmount !== null) {
        productVariationUpdatePage.setDiscountAmountInput(productVariationSample.discountAmount);
      }
      if (productVariationSample.discountPercentage !== undefined && productVariationSample.discountPercentage !== null) {
        productVariationUpdatePage.setDiscountPercentageInput(productVariationSample.discountPercentage);
      }
      productVariationUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        productVariation = body;
      });

      productVariationComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
