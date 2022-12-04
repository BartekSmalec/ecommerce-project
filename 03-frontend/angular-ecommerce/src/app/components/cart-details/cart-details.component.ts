import { Component } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;


  constructor(private cartService: CartService) {

  }

  ngOnInit() {
    this.listCartDetails();
  }
  listCartDetails() {
    // gety a handle to the cartItems

    this.cartItems = this.cartService.cartItems;

    // subscribe to service totalPrice and quantity

    this.cartService.totalPrice.subscribe(data => { this.totalPrice = data });
    this.cartService.totalQuantity.subscribe(data => { this.totalQuantity = data });

    // compute car ttotal price and quantity

    this.cartService.computeCartTotals();
  }

  incrementQuantity(tempCartItem: CartItem) {
    this.cartService.addToCart(tempCartItem);
  }

  decrementQuantity(tempCartItem: CartItem) {
    this.cartService.decrementQuantity(tempCartItem);
  }

  remove(tempCartItem: CartItem)
  {
    this.cartService.remove(tempCartItem);
  }

}
