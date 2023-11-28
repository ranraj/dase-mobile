import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  PartyTypeComponentsPage,
  PartyTypeDetailPage,
  PartyTypeUpdatePage,
} from '../../../support/pages/entities/party-type/party-type.po';
import partyTypeSample from './party-type.json';

describe('PartyType entity', () => {
  const COMPONENT_TITLE = 'Party Types';
  const SUBCOMPONENT_TITLE = 'Party Type';

  const partyTypePageUrl = '/tabs/entities/party-type';
  const partyTypeApiUrl = '/api/party-types';

  const partyTypeComponentsPage = new PartyTypeComponentsPage();
  const partyTypeUpdatePage = new PartyTypeUpdatePage();
  const partyTypeDetailPage = new PartyTypeDetailPage();

  let partyType: any;

  beforeEach(() => {
    partyType = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load PartyTypes page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      partyTypeComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', partyTypePageUrl);

      partyTypeComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create PartyType page and go back', () => {
      cy.visit(partyTypePageUrl);
      partyTypeComponentsPage.clickOnCreateButton();

      partyTypeUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      partyTypeUpdatePage.back();
      cy.url().should('include', partyTypePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: partyTypeApiUrl,
        body: partyTypeSample,
      }).then(({ body }) => {
        partyType = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${partyTypeApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [partyType],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (partyType) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${partyTypeApiUrl}/${partyType.id}`,
        }).then(() => {
          partyType = undefined;
        });
      }
    });

    it('should open PartyType view, open PartyType edit and go back', () => {
      cy.visit(partyTypePageUrl);
      partyTypeComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      partyTypeDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (partyType.name !== undefined && partyType.name !== null) {
        partyTypeDetailPage.getNameContent().contains(partyType.name);
      }
      if (partyType.comment !== undefined && partyType.comment !== null) {
        partyTypeDetailPage.getCommentContent().contains(partyType.comment);
      }
      partyTypeDetailPage.edit();

      partyTypeUpdatePage.back();
      partyTypeDetailPage.back();
      cy.url().should('include', partyTypePageUrl);
    });

    it('should open PartyType view, open PartyType edit and save', () => {
      cy.visit(partyTypePageUrl);
      partyTypeComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      partyTypeDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      partyTypeDetailPage.edit();

      partyTypeUpdatePage.save();
      cy.url().should('include', partyTypePageUrl);
    });

    it('should delete PartyType', () => {
      cy.visit(partyTypePageUrl);
      partyTypeComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      partyTypeDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      partyTypeComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      partyType = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: partyTypeApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (partyType) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${partyTypeApiUrl}/${partyType.id}`,
        }).then(() => {
          partyType = undefined;
        });
      }
    });

    it('should create PartyType', () => {
      cy.visit(partyTypePageUrl + '/new');

      partyTypeUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (partyTypeSample.name !== undefined && partyTypeSample.name !== null) {
        partyTypeUpdatePage.setNameInput(partyTypeSample.name);
      }
      if (partyTypeSample.comment !== undefined && partyTypeSample.comment !== null) {
        partyTypeUpdatePage.setCommentInput(partyTypeSample.comment);
      }
      partyTypeUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        partyType = body;
      });

      partyTypeComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
