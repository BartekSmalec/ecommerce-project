import { Component } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent {

  product!: Product; // ! non-null asserion operator

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetais();
    })
  }

  handleProductDetais() {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!; // "+" converts string to number
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

  addToCart() {
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    const theCartItem = new CartItem(this.product);
    this.cartService.addToCart(theCartItem);
  }

}
