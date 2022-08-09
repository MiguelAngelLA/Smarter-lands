import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinThreeComponent } from './bin-three.component';

describe('BinThreeComponent', () => {
  let component: BinThreeComponent;
  let fixture: ComponentFixture<BinThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BinThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
