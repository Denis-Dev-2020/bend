import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsmainComponent } from './productsmain.component';

describe('ProductsmainComponent', () => {
  let component: ProductsmainComponent;
  let fixture: ComponentFixture<ProductsmainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsmainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductsmainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
