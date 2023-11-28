import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { PartyComponentsPage, PartyDetailPage, PartyUpdatePage } from '../../../support/pages/entities/party/party.po';
import partySample from './party.json';

describe('Party entity', () => {
  const COMPONENT_TITLE = 'Parties';
  const SUBCOMPONENT_TITLE = 'Party';

  const partyPageUrl = '/tabs/entities/party';
  const partyApiUrl = '/api/parties';

  const partyComponentsPage = new PartyComponentsPage();
  const partyUpdatePage = new PartyUpdatePage();
  const partyDetailPage = new PartyDetailPage();

  let party: any;

  beforeEach(() => {
    party = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Parties page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      partyComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', partyPageUrl);

      partyComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Party page and go back', () => {
      cy.visit(partyPageUrl);
      partyComponentsPage.clickOnCreateButton();

      partyUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      partyUpdatePage.back();
      cy.url().should('include', partyPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: partyApiUrl,
        body: partySample,
      }).then(({ body }) => {
        party = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${partyApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [party],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (party) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${partyApiUrl}/${party.id}`,
        }).then(() => {
          party = undefined;
        });
      }
    });

    it('should open Party view, open Party edit and go back', () => {
      cy.visit(partyPageUrl);
      partyComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      partyDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (party.name !== undefined && party.name !== null) {
        partyDetailPage.getNameContent().contains(party.name);
      }
      if (party.email !== undefined && party.email !== null) {
        partyDetailPage.getEmailContent().contains(party.email);
      }
      if (party.gstNo !== undefined && party.gstNo !== null) {
        partyDetailPage.getGstNoContent().contains(party.gstNo);
      }
      if (party.phone !== undefined && party.phone !== null) {
        partyDetailPage.getPhoneContent().contains(party.phone);
      }
      if (party.comments !== undefined && party.comments !== null) {
        partyDetailPage.getCommentsContent().contains(party.comments);
      }
      partyDetailPage.edit();

      partyUpdatePage.back();
      partyDetailPage.back();
      cy.url().should('include', partyPageUrl);
    });

    it('should open Party view, open Party edit and save', () => {
      cy.visit(partyPageUrl);
      partyComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      partyDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      partyDetailPage.edit();

      partyUpdatePage.save();
      cy.url().should('include', partyPageUrl);
    });

    it('should delete Party', () => {
      cy.visit(partyPageUrl);
      partyComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      partyDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      partyComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      party = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: partyApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (party) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${partyApiUrl}/${party.id}`,
        }).then(() => {
          party = undefined;
        });
      }
    });

    it('should create Party', () => {
      cy.visit(partyPageUrl + '/new');

      partyUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (partySample.name !== undefined && partySample.name !== null) {
        partyUpdatePage.setNameInput(partySample.name);
      }
      if (partySample.email !== undefined && partySample.email !== null) {
        partyUpdatePage.setEmailInput(partySample.email);
      }
      if (partySample.gstNo !== undefined && partySample.gstNo !== null) {
        partyUpdatePage.setGstNoInput(partySample.gstNo);
      }
      if (partySample.phone !== undefined && partySample.phone !== null) {
        partyUpdatePage.setPhoneInput(partySample.phone);
      }
      if (partySample.comments !== undefined && partySample.comments !== null) {
        partyUpdatePage.setCommentsInput(partySample.comments);
      }
      if (partySample.primaryType !== undefined && partySample.primaryType !== null) {
        partyUpdatePage.setPrimaryTypeInput(partySample.primaryType);
      }
      partyUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        party = body;
      });

      partyComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
