import { EntityComponentsPage, EntityDetailPage, EntityUpdatePage } from '../../entity.po';

export class FacilityComponentsPage extends EntityComponentsPage {
  pageSelector = 'page-facility';
}

export class FacilityUpdatePage extends EntityUpdatePage {
  pageSelector = 'page-facility-update';

  setNameInput(name: string) {
    this.setInputValue('name', name);
  }

  setGeoLocationInput(geoLocation: string) {
    this.setInputValue('geoLocation', geoLocation);
  }
}

export class FacilityDetailPage extends EntityDetailPage {
  pageSelector = 'page-facility-detail';

  getNameContent() {
    return cy.get('#name-content');
  }

  getGeoLocationContent() {
    return cy.get('#geoLocation-content');
  }
}
