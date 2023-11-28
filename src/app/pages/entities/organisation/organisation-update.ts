import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder as FormBuilder, Validators } from '@angular/forms';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Organisation } from './organisation.model';
import { OrganisationService } from './organisation.service';
import { User } from '../../../services/user/user.model';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'page-organisation-update',
  templateUrl: 'organisation-update.html',
})
export class OrganisationUpdatePage implements OnInit {
  organisation: Organisation;
  users: User[];
  isSaving = false;
  isNew = true;
  isReadyToSave: boolean;

  form = this.formBuilder.group({
    id: [null, []],
    name: [null, [Validators.required]],
    domain: [null, []],
    cname: [null, []],
    user: [null, [Validators.required]],
  });

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected navController: NavController,
    protected formBuilder: FormBuilder,
    public platform: Platform,
    protected toastCtrl: ToastController,
    private userService: UserService,
    private organisationService: OrganisationService
  ) {
    // Watch the form for changes, and
    this.form.valueChanges.subscribe(v => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ngOnInit() {
    this.userService.findAll().subscribe(
      data => (this.users = data),
      error => this.onError(error)
    );
    this.activatedRoute.data.subscribe(response => {
      this.organisation = response.data;
      this.isNew = this.organisation.id === null || this.organisation.id === undefined;
      this.updateForm(this.organisation);
    });
  }

  updateForm(organisation: Organisation) {
    this.form.patchValue({
      id: organisation.id,
      name: organisation.name,
      domain: organisation.domain,
      cname: organisation.cname,
      user: organisation.user,
    });
  }

  save() {
    this.isSaving = true;
    const organisation = this.createFromForm();
    if (!this.isNew) {
      this.subscribeToSaveResponse(this.organisationService.update(organisation));
    } else {
      this.subscribeToSaveResponse(this.organisationService.create(organisation));
    }
  }

  async onSaveSuccess(response) {
    let action = 'updated';
    if (response.status === 201) {
      action = 'created';
    }
    this.isSaving = false;
    const toast = await this.toastCtrl.create({ message: `Organisation ${action} successfully.`, duration: 2000, position: 'middle' });
    await toast.present();
    await this.navController.navigateBack('/tabs/entities/organisation');
  }

  previousState() {
    window.history.back();
  }

  async onError(error) {
    this.isSaving = false;
    console.error(error);
    const toast = await this.toastCtrl.create({ message: 'Failed to load data', duration: 2000, position: 'middle' });
    await toast.present();
  }

  compareUser(first: User, second: User): boolean {
    return first && first.id && second && second.id ? first.id === second.id : first === second;
  }

  trackUserById(index: number, item: User) {
    return item.id;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<Organisation>>) {
    result.subscribe(
      (res: HttpResponse<Organisation>) => this.onSaveSuccess(res),
      (res: HttpErrorResponse) => this.onError(res.error)
    );
  }

  private createFromForm(): Organisation {
    return {
      ...new Organisation(),
      id: this.form.get(['id']).value,
      name: this.form.get(['name']).value,
      domain: this.form.get(['domain']).value,
      cname: this.form.get(['cname']).value,
      user: this.form.get(['user']).value,
    };
  }
}
