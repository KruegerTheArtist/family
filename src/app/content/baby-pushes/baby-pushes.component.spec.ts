import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabyPushesComponent } from './baby-pushes.component';

describe('BabyPushesComponent', () => {
  let component: BabyPushesComponent;
  let fixture: ComponentFixture<BabyPushesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BabyPushesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BabyPushesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
