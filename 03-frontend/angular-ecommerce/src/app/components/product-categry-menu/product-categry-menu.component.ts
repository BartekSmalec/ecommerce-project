import { Component } from '@angular/core';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';
import { ROUTER_CONFIGURATION } from '@angular/router';

@Component({
  selector: 'app-product-categry-menu',
  templateUrl: './product-categry-menu.component.html',
  styleUrls: ['./product-categry-menu.component.css']
})
export class ProductCategryMenuComponent {

  productCategories: ProductCategory[] = [];

  constructor(private productService: ProductService)
  {

  }

  ngOnInit()
  {
    this.listProductCategories();
  }

  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        console.log('Product Categories=' + JSON.stringify(data));
        this.productCategories = data;
      }
    );
  }
}
