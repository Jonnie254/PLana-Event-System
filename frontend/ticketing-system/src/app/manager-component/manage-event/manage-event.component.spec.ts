import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEventComponent } from './manage-event.component';

describe('ManageEventComponent', () => {
  let component: ManageEventComponent;
  let fixture: ComponentFixture<ManageEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageEventComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
