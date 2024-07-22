import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAllEventsComponent } from './manage-all-events.component';

describe('ManageAllEventsComponent', () => {
  let component: ManageAllEventsComponent;
  let fixture: ComponentFixture<ManageAllEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAllEventsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAllEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
