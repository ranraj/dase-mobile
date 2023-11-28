import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  ProductAttributesComponentsPage,
  ProductAttributesDetailPage,
  ProductAttributesUpdatePage,
} from '../../../support/pages/entities/product-attributes/product-attributes.po';
import productAttributesSample from './product-attributes.json';

describe('ProductAttributes entity', () => {
  const COMPONENT_TITLE = 'Product Attributes';
  const SUBCOMPONENT_TITLE = 'Product Attributes';

  const productAttributesPageUrl = '/tabs/entities/product-attributes';
  const productAttributesApiUrl = '/api/product-attributes';

  const productAttributesComponentsPage = new ProductAttributesComponentsPage();
  const productAttributesUpdatePage = new ProductAttributesUpdatePage();
  const productAttributesDetailPage = new ProductAttributesDetailPage();

  let productAttributes: any;

  beforeEach(() => {
    productAttributes = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load ProductAttributes page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      productAttributesComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', productAttributesPageUrl);

      productAttributesComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create ProductAttributes page and go back', () => {
      cy.visit(productAttributesPageUrl);
      productAttributesComponentsPage.clickOnCreateButton();

      productAttributesUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      productAttributesUpdatePage.back();
      cy.url().should('include', productAttributesPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: productAttributesApiUrl,
        body: productAttributesSample,
      }).then(({ body }) => {
        productAttributes = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${productAttributesApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [productAttributes],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (productAttributes) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productAttributesApiUrl}/${productAttributes.id}`,
        }).then(() => {
          productAttributes = undefined;
        });
      }
    });

    it('should open ProductAttributes view, open ProductAttributes edit and go back', () => {
      cy.visit(productAttributesPageUrl);
      productAttributesComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productAttributesDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (productAttributes.name !== undefined && productAttributes.name !== null) {
        productAttributesDetailPage.getNameContent().contains(productAttributes.name);
      }
      if (productAttributes.value !== undefined && productAttributes.value !== null) {
        productAttributesDetailPage.getValueContent().contains(productAttributes.value);
      }
      if (productAttributes.comments !== undefined && productAttributes.comments !== null) {
        productAttributesDetailPage.getCommentsContent().contains(productAttributes.comments);
      }
      productAttributesDetailPage.edit();

      productAttributesUpdatePage.back();
      productAttributesDetailPage.back();
      cy.url().should('include', productAttributesPageUrl);
    });

    it('should open ProductAttributes view, open ProductAttributes edit and save', () => {
      cy.visit(productAttributesPageUrl);
      productAttributesComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productAttributesDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      productAttributesDetailPage.edit();

      productAttributesUpdatePage.save();
      cy.url().should('include', productAttributesPageUrl);
    });

    it('should delete ProductAttributes', () => {
      cy.visit(productAttributesPageUrl);
      productAttributesComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      productAttributesDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      productAttributesComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      productAttributes = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: productAttributesApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (productAttributes) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${productAttributesApiUrl}/${productAttributes.id}`,
        }).then(() => {
          productAttributes = undefined;
        });
      }
    });

    it('should create ProductAttributes', () => {
      cy.visit(productAttributesPageUrl + '/new');

      productAttributesUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (productAttributesSample.name !== undefined && productAttributesSample.name !== null) {
        productAttributesUpdatePage.setNameInput(productAttributesSample.name);
      }
      if (productAttributesSample.value !== undefined && productAttributesSample.value !== null) {
        productAttributesUpdatePage.setValueInput(productAttributesSample.value);
      }
      if (productAttributesSample.comments !== undefined && productAttributesSample.comments !== null) {
        productAttributesUpdatePage.setCommentsInput(productAttributesSample.comments);
      }
      if (productAttributesSample.hidden !== undefined && productAttributesSample.hidden !== null) {
        productAttributesUpdatePage.setHiddenInput(productAttributesSample.hidden);
      }
      if (productAttributesSample.internal !== undefined && productAttributesSample.internal !== null) {
        productAttributesUpdatePage.setInternalInput(productAttributesSample.internal);
      }
      productAttributesUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        productAttributes = body;
      });

      productAttributesComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
