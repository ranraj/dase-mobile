import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { OrderComponentsPage, OrderDetailPage, OrderUpdatePage } from '../../../support/pages/entities/order/order.po';
import orderSample from './order.json';

describe('Order entity', () => {
  const COMPONENT_TITLE = 'Orders';
  const SUBCOMPONENT_TITLE = 'Order';

  const orderPageUrl = '/tabs/entities/order';
  const orderApiUrl = '/api/orders';

  const orderComponentsPage = new OrderComponentsPage();
  const orderUpdatePage = new OrderUpdatePage();
  const orderDetailPage = new OrderDetailPage();

  let order: any;

  beforeEach(() => {
    order = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Orders page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      orderComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', orderPageUrl);

      orderComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Order page and go back', () => {
      cy.visit(orderPageUrl);
      orderComponentsPage.clickOnCreateButton();

      orderUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      orderUpdatePage.back();
      cy.url().should('include', orderPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: orderApiUrl,
        body: orderSample,
      }).then(({ body }) => {
        order = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${orderApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [order],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (order) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${orderApiUrl}/${order.id}`,
        }).then(() => {
          order = undefined;
        });
      }
    });

    it('should open Order view, open Order edit and go back', () => {
      cy.visit(orderPageUrl);
      orderComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      orderDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (order.cgst !== undefined && order.cgst !== null) {
        orderDetailPage.getCgstContent().contains(order.cgst);
      }
      if (order.sgst !== undefined && order.sgst !== null) {
        orderDetailPage.getSgstContent().contains(order.sgst);
      }
      if (order.totalPrice !== undefined && order.totalPrice !== null) {
        orderDetailPage.getTotalPriceContent().contains(order.totalPrice);
      }
      if (order.paymentReference !== undefined && order.paymentReference !== null) {
        orderDetailPage.getPaymentReferenceContent().contains(order.paymentReference);
      }
      orderDetailPage.edit();

      orderUpdatePage.back();
      orderDetailPage.back();
      cy.url().should('include', orderPageUrl);
    });

    it('should open Order view, open Order edit and save', () => {
      cy.visit(orderPageUrl);
      orderComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      orderDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      orderDetailPage.edit();

      orderUpdatePage.save();
      cy.url().should('include', orderPageUrl);
    });

    it('should delete Order', () => {
      cy.visit(orderPageUrl);
      orderComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      orderDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      orderComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      order = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: orderApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (order) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${orderApiUrl}/${order.id}`,
        }).then(() => {
          order = undefined;
        });
      }
    });

    it('should create Order', () => {
      cy.visit(orderPageUrl + '/new');

      orderUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (orderSample.placedDate !== undefined && orderSample.placedDate !== null) {
        orderUpdatePage.setPlacedDateInput(orderSample.placedDate);
      }
      if (orderSample.status !== undefined && orderSample.status !== null) {
        orderUpdatePage.setStatusInput(orderSample.status);
      }
      if (orderSample.cgst !== undefined && orderSample.cgst !== null) {
        orderUpdatePage.setCgstInput(orderSample.cgst);
      }
      if (orderSample.sgst !== undefined && orderSample.sgst !== null) {
        orderUpdatePage.setSgstInput(orderSample.sgst);
      }
      if (orderSample.totalPrice !== undefined && orderSample.totalPrice !== null) {
        orderUpdatePage.setTotalPriceInput(orderSample.totalPrice);
      }
      if (orderSample.paymentMethod !== undefined && orderSample.paymentMethod !== null) {
        orderUpdatePage.setPaymentMethodInput(orderSample.paymentMethod);
      }
      if (orderSample.paymentReference !== undefined && orderSample.paymentReference !== null) {
        orderUpdatePage.setPaymentReferenceInput(orderSample.paymentReference);
      }
      if (orderSample.billingStatus !== undefined && orderSample.billingStatus !== null) {
        orderUpdatePage.setBillingStatusInput(orderSample.billingStatus);
      }
      orderUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        order = body;
      });

      orderComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
