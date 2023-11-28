import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import {
  OrganisationComponentsPage,
  OrganisationDetailPage,
  OrganisationUpdatePage,
} from '../../../support/pages/entities/organisation/organisation.po';
import organisationSample from './organisation.json';

describe('Organisation entity', () => {
  const COMPONENT_TITLE = 'Organisations';
  const SUBCOMPONENT_TITLE = 'Organisation';

  const organisationPageUrl = '/tabs/entities/organisation';
  const organisationApiUrl = '/api/organisations';

  const organisationComponentsPage = new OrganisationComponentsPage();
  const organisationUpdatePage = new OrganisationUpdatePage();
  const organisationDetailPage = new OrganisationDetailPage();

  let organisation: any;

  beforeEach(() => {
    organisation = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Organisations page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      organisationComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', organisationPageUrl);

      organisationComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Organisation page and go back', () => {
      cy.visit(organisationPageUrl);
      organisationComponentsPage.clickOnCreateButton();

      organisationUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      organisationUpdatePage.back();
      cy.url().should('include', organisationPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: organisationApiUrl,
        body: organisationSample,
      }).then(({ body }) => {
        organisation = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${organisationApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [organisation],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (organisation) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${organisationApiUrl}/${organisation.id}`,
        }).then(() => {
          organisation = undefined;
        });
      }
    });

    it('should open Organisation view, open Organisation edit and go back', () => {
      cy.visit(organisationPageUrl);
      organisationComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      organisationDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (organisation.name !== undefined && organisation.name !== null) {
        organisationDetailPage.getNameContent().contains(organisation.name);
      }
      if (organisation.domain !== undefined && organisation.domain !== null) {
        organisationDetailPage.getDomainContent().contains(organisation.domain);
      }
      if (organisation.cname !== undefined && organisation.cname !== null) {
        organisationDetailPage.getCnameContent().contains(organisation.cname);
      }
      organisationDetailPage.edit();

      organisationUpdatePage.back();
      organisationDetailPage.back();
      cy.url().should('include', organisationPageUrl);
    });

    it('should open Organisation view, open Organisation edit and save', () => {
      cy.visit(organisationPageUrl);
      organisationComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      organisationDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      organisationDetailPage.edit();

      organisationUpdatePage.save();
      cy.url().should('include', organisationPageUrl);
    });

    it('should delete Organisation', () => {
      cy.visit(organisationPageUrl);
      organisationComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      organisationDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      organisationComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      organisation = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: organisationApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (organisation) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${organisationApiUrl}/${organisation.id}`,
        }).then(() => {
          organisation = undefined;
        });
      }
    });

    it('should create Organisation', () => {
      cy.visit(organisationPageUrl + '/new');

      organisationUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (organisationSample.name !== undefined && organisationSample.name !== null) {
        organisationUpdatePage.setNameInput(organisationSample.name);
      }
      if (organisationSample.domain !== undefined && organisationSample.domain !== null) {
        organisationUpdatePage.setDomainInput(organisationSample.domain);
      }
      if (organisationSample.cname !== undefined && organisationSample.cname !== null) {
        organisationUpdatePage.setCnameInput(organisationSample.cname);
      }
      organisationUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        organisation = body;
      });

      organisationComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
