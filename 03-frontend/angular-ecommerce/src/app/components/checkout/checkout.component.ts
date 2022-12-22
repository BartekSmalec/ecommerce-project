import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { environment } from 'src/environment/environment';
import { PaymentInfo } from 'src/app/common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup!: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];
  states: State[] = [];

  shippingAdressStates: State[] = [];
  billingAdressStates: State[] = [];

  storage: Storage = sessionStorage;
  theEmail: string = '';

  // init Stripe API

  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService, private cartService: CartService, private checkoutService: CheckoutService, private router: Router) {

  }

  ngOnInit() {

    // setup Stripe payment form

    this.setupStripePaymentForm();

    this.reviewCartDetails();

    this.theEmail = this.storage.getItem('userEmail')!;

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        lastName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        email: new FormControl(this.theEmail,
          [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group(
        {
          street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
          country: new FormControl('', [Validators.required]),
          state: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        }),
      billingAddress: this.formBuilder.group(
        {
          street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
          country: new FormControl('', [Validators.required]),
          state: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
        }),
      creditCard: this.formBuilder.group(
        {
          /*       cardType: new FormControl('', [Validators.required]),
                nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhiteSpace]),
                cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
                securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
                expirationMonth: [''],
                expirationYear: [''] */
        }),
    })

    // populate credit card months and year

    /*  const startMonth: number = new Date().getMonth() + 1;
 
     this.shopFormService.getCreditCardMonths(startMonth).subscribe(data => {
       console.log("Months: " + JSON.stringify(data));
       this.creditCardMonths = data;
     });
 
     this.shopFormService.getCreditCardYears().subscribe(data => {
       console.log("Years: " + JSON.stringify(data));
       this.creditCardYears = data;
     }); */


    this.shopFormService.getCountries().subscribe(data => {
      console.log("Countires: " + JSON.stringify(data));
      this.countries = data;
    })
  }
  setupStripePaymentForm() {
    // get a handle to stripe elements

    var elements = this.stripe.elements();

    // create a card element and hide zip-code field

    this.cardElement = elements.create('card', { hidePostalCode: true });

    // add an instance of card ui component into the 'card-element'

    this.cardElement.mount('#card-element');


    // add event binding for the 'change' event on the card element

    this.cardElement.on('change', (event: any) => {

      // get a handle to card-errors
      this.displayError = document.getElementById('card-errors');
      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });

  }
  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(totalPrice => {
      this.totalPrice = totalPrice;
    });
    this.cartService.totalQuantity.subscribe(totalQuantity => {
      this.totalQuantity = totalQuantity;
    });
  }


  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  //billingAddress
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  //creditCard
  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }



  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched(); // Triggers the display of the error messages
      return;
    }

    // set up order

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;


    // get cart items
    const cartItem = this.cartService.cartItems;
    // create OrderItem form cartItems

    // long way
    /*
    let orderItems: OrderItem[] = [];
    for(let i=0; i < cartItem.length; i++)
    {
      orderItems[i] = new OrderItem(cartItem[i])
    }*/

    // short way
    let orderItems: OrderItem[] = cartItem.map(tempCartItem => new OrderItem(tempCartItem));


    // set up a purchase

    let purchase = new Purchase();

    // pupulate purchase - customer

    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // pupulate purchase - shipping address

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;


    // pupulate purchase - billing address

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // pupulate purchase - order and orderItems

    purchase.order = order;
    purchase.orderItems = orderItems;

    // compute payment info

    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";

    console.log(`Payment info amount: ${this.paymentInfo.amount}`);

    // call REST API via the checkoutService

    /*  this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`);
        // reset cart
        this.resetCart();
      },
      error: err => {
        alert(`There was an error: ${err.message}`);
      }
    }); */

    // if valid form then
    // create payment intent
    // confirm card payment
    // place order

    if (!this.checkoutFormGroup.invalid && this.displayError.textContent == "") {
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
            payment_method: {
              card: this.cardElement
            }
          }, { handleActions: false }
          ).then((result: any) => {
            if (result.error) {
              // inform the customer there was an error
              alert(`There was an error: ${result.error.message}`);
            } else {
              // call rest api via checkoutService
              this.checkoutService.placeOrder(purchase).subscribe({
                next: (response: any) => {
                  alert(`Your tracking number: ${response.orderTrackingNumber}`);
                  this.resetCart();
                },
                error: (err: any) => {
                  alert(`There was an error: ${err.message}`);
                }
              })
            }
          });
        }
      );
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }
  resetCart() {
    // reset cart data;
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    // resety the form
    this.checkoutFormGroup.reset();
    // navigate back to products page
    this.router.navigateByUrl("/products");
  }
  copyShippingAdressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      // bug fix for states
      this.billingAdressStates = this.shippingAdressStates;
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingAdressStates = [];
    }
  }
  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    console.log(`Selected year: ${selectedYear}`);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;

    this.shopFormService.getStates(countryCode).subscribe(data => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAdressStates = data;
        console.log(`shippingAdressStates: ${this.shippingAdressStates[0].name}`);
      }
      else {
        this.billingAdressStates = data;
        console.log(`billingAdressStates: ${this.billingAdressStates[0].name}`);

      }

      // select first item by defoult
      formGroup?.get('state')?.setValue(data[0]);

    });
  }

}
