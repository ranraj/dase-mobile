import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { FacilityComponentsPage, FacilityDetailPage, FacilityUpdatePage } from '../../../support/pages/entities/facility/facility.po';
import facilitySample from './facility.json';

describe('Facility entity', () => {
  const COMPONENT_TITLE = 'Facilities';
  const SUBCOMPONENT_TITLE = 'Facility';

  const facilityPageUrl = '/tabs/entities/facility';
  const facilityApiUrl = '/api/facilities';

  const facilityComponentsPage = new FacilityComponentsPage();
  const facilityUpdatePage = new FacilityUpdatePage();
  const facilityDetailPage = new FacilityDetailPage();

  let facility: any;

  beforeEach(() => {
    facility = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Facilities page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      facilityComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', facilityPageUrl);

      facilityComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Facility page and go back', () => {
      cy.visit(facilityPageUrl);
      facilityComponentsPage.clickOnCreateButton();

      facilityUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      facilityUpdatePage.back();
      cy.url().should('include', facilityPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: facilityApiUrl,
        body: facilitySample,
      }).then(({ body }) => {
        facility = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${facilityApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [facility],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (facility) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${facilityApiUrl}/${facility.id}`,
        }).then(() => {
          facility = undefined;
        });
      }
    });

    it('should open Facility view, open Facility edit and go back', () => {
      cy.visit(facilityPageUrl);
      facilityComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      facilityDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (facility.name !== undefined && facility.name !== null) {
        facilityDetailPage.getNameContent().contains(facility.name);
      }
      if (facility.geoLocation !== undefined && facility.geoLocation !== null) {
        facilityDetailPage.getGeoLocationContent().contains(facility.geoLocation);
      }
      facilityDetailPage.edit();

      facilityUpdatePage.back();
      facilityDetailPage.back();
      cy.url().should('include', facilityPageUrl);
    });

    it('should open Facility view, open Facility edit and save', () => {
      cy.visit(facilityPageUrl);
      facilityComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      facilityDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      facilityDetailPage.edit();

      facilityUpdatePage.save();
      cy.url().should('include', facilityPageUrl);
    });

    it('should delete Facility', () => {
      cy.visit(facilityPageUrl);
      facilityComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      facilityDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      facilityComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      facility = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: facilityApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (facility) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${facilityApiUrl}/${facility.id}`,
        }).then(() => {
          facility = undefined;
        });
      }
    });

    it('should create Facility', () => {
      cy.visit(facilityPageUrl + '/new');

      facilityUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (facilitySample.name !== undefined && facilitySample.name !== null) {
        facilityUpdatePage.setNameInput(facilitySample.name);
      }
      if (facilitySample.geoLocation !== undefined && facilitySample.geoLocation !== null) {
        facilityUpdatePage.setGeoLocationInput(facilitySample.geoLocation);
      }
      facilityUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        facility = body;
      });

      facilityComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
