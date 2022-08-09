import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinTwoComponent } from './bin-two.component';

describe('BinTwoComponent', () => {
  let component: BinTwoComponent;
  let fixture: ComponentFixture<BinTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BinTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
