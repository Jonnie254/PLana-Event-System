import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxNotificationsComponent } from './inbox-notifications.component';

describe('InboxNotificationsComponent', () => {
  let component: InboxNotificationsComponent;
  let fixture: ComponentFixture<InboxNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboxNotificationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InboxNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
