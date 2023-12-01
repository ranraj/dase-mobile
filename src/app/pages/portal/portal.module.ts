import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { PortalComponent } from './portal.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PortalComponent],
  imports: [IonicModule, FormsModule, ReactiveFormsModule, CommonModule, FormsModule, TranslateModule, PortalRoutingModule],
  bootstrap: [PortalComponent]
})
export class PortalModule { }
