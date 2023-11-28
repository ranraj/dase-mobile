import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class OrganisationComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-organisation';
}

export class OrganisationUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-organisation-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setDomainInput(domain: string) {
    this.setInputValue('domain', domain);
  }

  setCnameInput(cname: string) {
    this.setInputValue('cname', cname);
  }
}

export class OrganisationDetailPage extends EntityDetailPage {
  pageSelector = 'page-organisation-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getDomainContent() {
    return cy.get('#domain-content');
  }

  getCnameContent() {
    return cy.get('#cname-content');
  }
}
