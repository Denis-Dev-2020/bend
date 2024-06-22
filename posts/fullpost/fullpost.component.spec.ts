import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullpostComponent } from './fullpost.component';

describe('FullpostComponent', () => {
  let component: FullpostComponent;
  let fixture: ComponentFixture<FullpostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullpostComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FullpostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
