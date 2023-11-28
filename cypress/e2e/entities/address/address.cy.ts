import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { AddressComponentsPage, AddressDetailPage, AddressUpdatePage } from '../../../support/pages/entities/address/address.po';
import addressSample from './address.json';

describe('Address entity', () => {
  const COMPONENT_TITLE = 'Addresses';
  const SUBCOMPONENT_TITLE = 'Address';

  const addressPageUrl = '/tabs/entities/address';
  const addressApiUrl = '/api/addresses';

  const addressComponentsPage = new AddressComponentsPage();
  const addressUpdatePage = new AddressUpdatePage();
  const addressDetailPage = new AddressDetailPage();

  let address: any;

  beforeEach(() => {
    address = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Addresses page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      addressComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', addressPageUrl);

      addressComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Address page and go back', () => {
      cy.visit(addressPageUrl);
      addressComponentsPage.clickOnCreateButton();

      addressUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      addressUpdatePage.back();
      cy.url().should('include', addressPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: addressApiUrl,
        body: addressSample,
      }).then(({ body }) => {
        address = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${addressApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [address],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (address) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${addressApiUrl}/${address.id}`,
        }).then(() => {
          address = undefined;
        });
      }
    });

    it('should open Address view, open Address edit and go back', () => {
      cy.visit(addressPageUrl);
      addressComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      addressDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (address.addressLine1 !== undefined && address.addressLine1 !== null) {
        addressDetailPage.getAddressLine1Content().contains(address.addressLine1);
      }
      if (address.addressLine2 !== undefined && address.addressLine2 !== null) {
        addressDetailPage.getAddressLine2Content().contains(address.addressLine2);
      }
      if (address.localState !== undefined && address.localState !== null) {
        addressDetailPage.getLocalStateContent().contains(address.localState);
      }
      if (address.city !== undefined && address.city !== null) {
        addressDetailPage.getCityContent().contains(address.city);
      }
      if (address.country !== undefined && address.country !== null) {
        addressDetailPage.getCountryContent().contains(address.country);
      }
      if (address.postalCode !== undefined && address.postalCode !== null) {
        addressDetailPage.getPostalCodeContent().contains(address.postalCode);
      }
      addressDetailPage.edit();

      addressUpdatePage.back();
      addressDetailPage.back();
      cy.url().should('include', addressPageUrl);
    });

    it('should open Address view, open Address edit and save', () => {
      cy.visit(addressPageUrl);
      addressComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      addressDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      addressDetailPage.edit();

      addressUpdatePage.save();
      cy.url().should('include', addressPageUrl);
    });

    it('should delete Address', () => {
      cy.visit(addressPageUrl);
      addressComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      addressDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      addressComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      address = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: addressApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (address) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${addressApiUrl}/${address.id}`,
        }).then(() => {
          address = undefined;
        });
      }
    });

    it('should create Address', () => {
      cy.visit(addressPageUrl + '/new');

      addressUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (addressSample.addressLine1 !== undefined && addressSample.addressLine1 !== null) {
        addressUpdatePage.setAddressLine1Input(addressSample.addressLine1);
      }
      if (addressSample.addressLine2 !== undefined && addressSample.addressLine2 !== null) {
        addressUpdatePage.setAddressLine2Input(addressSample.addressLine2);
      }
      if (addressSample.localState !== undefined && addressSample.localState !== null) {
        addressUpdatePage.setLocalStateInput(addressSample.localState);
      }
      if (addressSample.city !== undefined && addressSample.city !== null) {
        addressUpdatePage.setCityInput(addressSample.city);
      }
      if (addressSample.country !== undefined && addressSample.country !== null) {
        addressUpdatePage.setCountryInput(addressSample.country);
      }
      if (addressSample.postalCode !== undefined && addressSample.postalCode !== null) {
        addressUpdatePage.setPostalCodeInput(addressSample.postalCode);
      }
      if (addressSample.addressType !== undefined && addressSample.addressType !== null) {
        addressUpdatePage.setAddressTypeInput(addressSample.addressType);
      }
      addressUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        address = body;
      });

      addressComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
