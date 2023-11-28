import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class PartyRoleComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-party-role';
}

export class PartyRoleUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-party-role-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setPermissionInput(permission: string) {
    this.setInputValue('permission', permission);
  }
}

export class PartyRoleDetailPage extends EntityDetailPage {
  pageSelector = 'page-party-role-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getPermissionContent() {
    return cy.get('#permission-content');
  }
}
