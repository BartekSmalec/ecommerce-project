import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>(); // Subject is a subclass of observable, we can use subject to publish events in our code, this event will be sen to subscribers
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() { }

  decrementQuantity(theCartItem: CartItem)
  {
    theCartItem.quantity--;
    if(theCartItem.quantity === 0){
      this.remove(theCartItem);
    }else{
      this.computeCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    const itemIndex =  this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id);
    if(itemIndex > -1)
    {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    //check if we have item already in cart
    console.log("addtoCartService()");

    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined!; // "!" non null assertion
    if (this.cartItems.length > 0) {
      // find the item in the cart based on item id

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id)!;
      // check if we found it

      alreadyExistInCart = (existingCartItem != undefined);
    }
    if (alreadyExistInCart) {
      existingCartItem.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    // compute cart total price and total quantity
    this.computeCartTotals();


  }
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;
    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the ne value to all subscribers will recevie the new data

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log

    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log("Contents of the cart");
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name} , quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice= ${subTotalPrice}`);

    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}  totalQuantity: ${totalQuantityValue}`);
    console.log(`----------`);
  }
}
