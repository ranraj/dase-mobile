import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  OrderItemComponentsPage,
  OrderItemDetailPage,
  OrderItemUpdatePage,
} from '../../../support/pages/entities/order-item/order-item.po';
import orderItemSample from './order-item.json';

describe('OrderItem entity', () => {
  const COMPONENT_TITLE = 'Order Items';
  const SUBCOMPONENT_TITLE = 'Order Item';

  const orderItemPageUrl = '/tabs/entities/order-item';
  const orderItemApiUrl = '/api/order-items';

  const orderItemComponentsPage = new OrderItemComponentsPage();
  const orderItemUpdatePage = new OrderItemUpdatePage();
  const orderItemDetailPage = new OrderItemDetailPage();

  let orderItem: any;

  beforeEach(() => {
    orderItem = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load OrderItems page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      orderItemComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', orderItemPageUrl);

      orderItemComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create OrderItem page and go back', () => {
      cy.visit(orderItemPageUrl);
      orderItemComponentsPage.clickOnCreateButton();

      orderItemUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      orderItemUpdatePage.back();
      cy.url().should('include', orderItemPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: orderItemApiUrl,
        body: orderItemSample,
      }).then(({ body }) => {
        orderItem = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${orderItemApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [orderItem],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (orderItem) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${orderItemApiUrl}/${orderItem.id}`,
        }).then(() => {
          orderItem = undefined;
        });
      }
    });

    it('should open OrderItem view, open OrderItem edit and go back', () => {
      cy.visit(orderItemPageUrl);
      orderItemComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      orderItemDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (orderItem.unitPrice !== undefined && orderItem.unitPrice !== null) {
        orderItemDetailPage.getUnitPriceContent().contains(orderItem.unitPrice);
      }
      if (orderItem.quantity !== undefined && orderItem.quantity !== null) {
        orderItemDetailPage.getQuantityContent().contains(orderItem.quantity);
      }
      if (orderItem.totalPrice !== undefined && orderItem.totalPrice !== null) {
        orderItemDetailPage.getTotalPriceContent().contains(orderItem.totalPrice);
      }
      orderItemDetailPage.edit();

      orderItemUpdatePage.back();
      orderItemDetailPage.back();
      cy.url().should('include', orderItemPageUrl);
    });

    it('should open OrderItem view, open OrderItem edit and save', () => {
      cy.visit(orderItemPageUrl);
      orderItemComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      orderItemDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      orderItemDetailPage.edit();

      orderItemUpdatePage.save();
      cy.url().should('include', orderItemPageUrl);
    });

    it('should delete OrderItem', () => {
      cy.visit(orderItemPageUrl);
      orderItemComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      orderItemDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      orderItemComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      orderItem = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: orderItemApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (orderItem) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${orderItemApiUrl}/${orderItem.id}`,
        }).then(() => {
          orderItem = undefined;
        });
      }
    });

    it('should create OrderItem', () => {
      cy.visit(orderItemPageUrl + '/new');

      orderItemUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (orderItemSample.unitPrice !== undefined && orderItemSample.unitPrice !== null) {
        orderItemUpdatePage.setUnitPriceInput(orderItemSample.unitPrice);
      }
      if (orderItemSample.quantity !== undefined && orderItemSample.quantity !== null) {
        orderItemUpdatePage.setQuantityInput(orderItemSample.quantity);
      }
      if (orderItemSample.totalPrice !== undefined && orderItemSample.totalPrice !== null) {
        orderItemUpdatePage.setTotalPriceInput(orderItemSample.totalPrice);
      }
      orderItemUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        orderItem = body;
      });

      orderItemComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
