import { Component } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previusCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  precoiusKeyWord: string = "";


  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    })
  }



  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  listProducts() {
    // check if "id" is available

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }
  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;


    if (this.precoiusKeyWord != theKeyword) {
      this.thePageNumber = 1;
    }

    this.precoiusKeyWord = theKeyword;

    console.log(`keyword=${theKeyword} thePageNumber=${this.thePageNumber}`);

    this.productService.searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword).subscribe(this.processResult());

  }
  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  handleListProducts() {

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      // get the "id", convert string to number using "+" at beginning "!" at the end is non-null assertion operator 

      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

    } else {
      this.currentCategoryId = 1;
    }

    if (this.previusCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previusCategoryId = this.currentCategoryId;

    console.log(`current=${this.currentCategoryId} + pageNumber=${this.thePageNumber}`);

    // check if we hgave different catefgory than previouis, if we have diffrent cateogry id than previus we wan pagenumber reset to one

    // get products by category
    this.productService.getProductListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult());

  }

  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}, ${product.unitPrice}`);
    const theCartItem = new CartItem(product);
    this.cartService.addToCart(theCartItem);
  }
}
