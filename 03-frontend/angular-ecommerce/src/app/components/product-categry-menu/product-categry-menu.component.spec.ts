import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCategryMenuComponent } from './product-categry-menu.component';

describe('ProductCategryMenuComponent', () => {
  let component: ProductCategryMenuComponent;
  let fixture: ComponentFixture<ProductCategryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductCategryMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductCategryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
