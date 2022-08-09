import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BinOneComponent } from './bin-one.component';

describe('BinOneComponent', () => {
  let component: BinOneComponent;
  let fixture: ComponentFixture<BinOneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BinOneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BinOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
