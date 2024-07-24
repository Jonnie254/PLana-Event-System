import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAllPromotionsComponent } from './manage-all-promotions.component';

describe('ManageAllPromotionsComponent', () => {
  let component: ManageAllPromotionsComponent;
  let fixture: ComponentFixture<ManageAllPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAllPromotionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageAllPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
