import { USER_USERNAME, USER_PASSWORD } from '../../../support/config';
import { CompanyComponentsPage, CompanyDetailPage, CompanyUpdatePage } from '../../../support/pages/entities/company/company.po';
import companySample from './company.json';

describe('Company entity', () => {
  const COMPONENT_TITLE = 'Companies';
  const SUBCOMPONENT_TITLE = 'Company';

  const companyPageUrl = '/tabs/entities/company';
  const companyApiUrl = '/api/companies';

  const companyComponentsPage = new CompanyComponentsPage();
  const companyUpdatePage = new CompanyUpdatePage();
  const companyDetailPage = new CompanyDetailPage();

  let company: any;

  beforeEach(() => {
    company = undefined;
    cy.login(USER_USERNAME, USER_PASSWORD);
  });

  describe('navigation test', () => {
    it('should load Companies page using menu and go back', () => {
      cy.visit('/tabs/home');
      // go to entity component page
      cy.get('ion-tab-button[tab="entities"]').click();
      cy.get('ion-item h2').contains(SUBCOMPONENT_TITLE).first().click();

      companyComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE).should('be.visible');
      cy.url().should('include', companyPageUrl);

      companyComponentsPage.back();
      cy.url().should('include', '/tabs/entities');
    });

    it('should load create Company page and go back', () => {
      cy.visit(companyPageUrl);
      companyComponentsPage.clickOnCreateButton();

      companyUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);

      companyUpdatePage.back();
      cy.url().should('include', companyPageUrl);
    });
  });

  describe('navigation test with items', () => {
    beforeEach(() => {
      cy.authenticatedRequest({
        method: 'POST',
        url: companyApiUrl,
        body: companySample,
      }).then(({ body }) => {
        company = body;

        cy.intercept(
          {
            method: 'GET',
            url: `${companyApiUrl}+(?*|)`,
            times: 1,
          },
          {
            statusCode: 200,
            body: [company],
          }
        ).as('entitiesRequestInternal');
      });
    });

    afterEach(() => {
      if (company) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${companyApiUrl}/${company.id}`,
        }).then(() => {
          company = undefined;
        });
      }
    });

    it('should open Company view, open Company edit and go back', () => {
      cy.visit(companyPageUrl);
      companyComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      companyDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      if (company.name !== undefined && company.name !== null) {
        companyDetailPage.getNameContent().contains(company.name);
      }
      if (company.displayName !== undefined && company.displayName !== null) {
        companyDetailPage.getDisplayNameContent().contains(company.displayName);
      }
      if (company.email !== undefined && company.email !== null) {
        companyDetailPage.getEmailContent().contains(company.email);
      }
      if (company.gstNo !== undefined && company.gstNo !== null) {
        companyDetailPage.getGstNoContent().contains(company.gstNo);
      }
      if (company.phone !== undefined && company.phone !== null) {
        companyDetailPage.getPhoneContent().contains(company.phone);
      }
      if (company.website !== undefined && company.website !== null) {
        companyDetailPage.getWebsiteContent().contains(company.website);
      }
      if (company.imageSrc !== undefined && company.imageSrc !== null) {
        companyDetailPage.getImageSrcContent().contains(company.imageSrc);
      }
      if (company.geoLocation !== undefined && company.geoLocation !== null) {
        companyDetailPage.getGeoLocationContent().contains(company.geoLocation);
      }
      companyDetailPage.edit();

      companyUpdatePage.back();
      companyDetailPage.back();
      cy.url().should('include', companyPageUrl);
    });

    it('should open Company view, open Company edit and save', () => {
      cy.visit(companyPageUrl);
      companyComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      companyDetailPage.getPageTitle().contains(SUBCOMPONENT_TITLE).should('be.visible');
      companyDetailPage.edit();

      companyUpdatePage.save();
      cy.url().should('include', companyPageUrl);
    });

    it('should delete Company', () => {
      cy.visit(companyPageUrl);
      companyComponentsPage.getPageTitle().should('be.visible');

      cy.wait('@entitiesRequestInternal');
      cy.get('ion-item').last().click();

      companyDetailPage.delete();
      cy.get('ion-alert button:not(.alert-button-role-cancel)').click();

      companyComponentsPage.getPageTitle().should('have.text', COMPONENT_TITLE);
      company = undefined;
    });
  });

  describe('creation test', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'POST',
        url: companyApiUrl,
        times: 1,
      }).as('entitiesPost');
    });

    afterEach(() => {
      if (company) {
        cy.authenticatedRequest({
          method: 'DELETE',
          url: `${companyApiUrl}/${company.id}`,
        }).then(() => {
          company = undefined;
        });
      }
    });

    it('should create Company', () => {
      cy.visit(companyPageUrl + '/new');

      companyUpdatePage.getPageTitle().should('have.text', SUBCOMPONENT_TITLE);
      if (companySample.name !== undefined && companySample.name !== null) {
        companyUpdatePage.setNameInput(companySample.name);
      }
      if (companySample.displayName !== undefined && companySample.displayName !== null) {
        companyUpdatePage.setDisplayNameInput(companySample.displayName);
      }
      if (companySample.email !== undefined && companySample.email !== null) {
        companyUpdatePage.setEmailInput(companySample.email);
      }
      if (companySample.gstNo !== undefined && companySample.gstNo !== null) {
        companyUpdatePage.setGstNoInput(companySample.gstNo);
      }
      if (companySample.phone !== undefined && companySample.phone !== null) {
        companyUpdatePage.setPhoneInput(companySample.phone);
      }
      if (companySample.website !== undefined && companySample.website !== null) {
        companyUpdatePage.setWebsiteInput(companySample.website);
      }
      if (companySample.imageSrc !== undefined && companySample.imageSrc !== null) {
        companyUpdatePage.setImageSrcInput(companySample.imageSrc);
      }
      if (companySample.gstType !== undefined && companySample.gstType !== null) {
        companyUpdatePage.setGstTypeInput(companySample.gstType);
      }
      if (companySample.currencyType !== undefined && companySample.currencyType !== null) {
        companyUpdatePage.setCurrencyTypeInput(companySample.currencyType);
      }
      if (companySample.geoLocation !== undefined && companySample.geoLocation !== null) {
        companyUpdatePage.setGeoLocationInput(companySample.geoLocation);
      }
      companyUpdatePage.save();

      cy.wait('@entitiesPost').then(({ response }) => {
        const { body } = response;
        company = body;
      });

      companyComponentsPage.getPageTitle().contains(COMPONENT_TITLE);
    });
  });
});
