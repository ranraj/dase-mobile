import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageUpdateComponent } from './storage-update.component';

describe('StorageUpdateComponent', () => {
  let component: StorageUpdateComponent;
  let fixture: ComponentFixture<StorageUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StorageUpdateComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
