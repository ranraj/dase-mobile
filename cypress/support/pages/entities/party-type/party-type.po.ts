import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class PartyTypeComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-party-type';
}

export class PartyTypeUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-party-type-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setCommentInput(comment: string) {
    this.setInputValue('comment', comment);
  }
}

export class PartyTypeDetailPage extends EntityDetailPage {
  pageSelector = 'page-party-type-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getCommentContent() {
    return cy.get('#comment-content');
  }
}
