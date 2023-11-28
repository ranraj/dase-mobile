import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  PartyRoleComponentsPage,
  PartyRoleDetailPage,
  PartyRoleUpdatePage,
} from '../../../support/pages/entities/party-role/party-role.po';
import partyRoleSample from './party-role.json';

describe('PartyRole entity', () => {
  const COMPONENT_TITLE = 'Party Roles';
  const SUBCOMPONENT_TITLE = 'Party Role';

  const partyRolePageUrl = '/tabs/entities/party-role';
  const partyRoleApiUrl = '/api/party-roles';

  const partyRoleComponentsPage = new PartyRoleComponentsPage();
  const partyRoleUpdatePage = new PartyRoleUpdatePage();
  const partyRoleDetailPage = new PartyRoleDetailPage();

  let partyRole: any;

  beforeEach(() => {
    partyRole = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load PartyRoles page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      partyRoleComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', partyRolePageUrl);

      partyRoleComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create PartyRole page and go back', () => {
      cy.visit(partyRolePageUrl);
      partyRoleComponentsPage.clickOnCreateButton();

      partyRoleUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      partyRoleUpdatePage.back();
      cy.url().should('include', partyRolePageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: partyRoleApiUrl,
        body: partyRoleSample,
      }).then(({ body }) => {
        partyRole = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${partyRoleApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [partyRole],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (partyRole) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${partyRoleApiUrl}/${partyRole.id}`,
        }).then(() => {
          partyRole = undefined;
        });
      }
    });

    it('should open PartyRole view, open PartyRole edit and go back', () => {
      cy.visit(partyRolePageUrl);
      partyRoleComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      partyRoleDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (partyRole.name !== undefined && partyRole.name !== null) {
        partyRoleDetailPage.getNameContent().contains(partyRole.name);
      }
      if (partyRole.permission !== undefined && partyRole.permission !== null) {
        partyRoleDetailPage.getPermissionContent().contains(partyRole.permission);
      }
      partyRoleDetailPage.edit();

      partyRoleUpdatePage.back();
      partyRoleDetailPage.back();
      cy.url().should('include', partyRolePageUrl);
    });

    it('should open PartyRole view, open PartyRole edit and save', () => {
      cy.visit(partyRolePageUrl);
      partyRoleComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      partyRoleDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      partyRoleDetailPage.edit();

      partyRoleUpdatePage.save();
      cy.url().should('include', partyRolePageUrl);
    });

    it('should delete PartyRole', () => {
      cy.visit(partyRolePageUrl);
      partyRoleComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      partyRoleDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      partyRoleComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      partyRole = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: partyRoleApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (partyRole) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${partyRoleApiUrl}/${partyRole.id}`,
        }).then(() => {
          partyRole = undefined;
        });
      }
    });

    it('should create PartyRole', () => {
      cy.visit(partyRolePageUrl + '/new');

      partyRoleUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (partyRoleSample.name !== undefined && partyRoleSample.name !== null) {
        partyRoleUpdatePage.setNameInput(partyRoleSample.name);
      }
      if (partyRoleSample.permission !== undefined && partyRoleSample.permission !== null) {
        partyRoleUpdatePage.setPermissionInput(partyRoleSample.permission);
      }
      partyRoleUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        partyRole = body;
      });

      partyRoleComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
