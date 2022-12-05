import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { JsonPipe } from '@angular/common';

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

  constructor(private formBuilder: FormBuilder, private shopFormService: ShopFormService) {

  }

  ngOnInit() {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group(
        {
          street: [''],
          city: [''],
          country: [''],
          state: [''],
          zipCode: [''],
        }),
      billingAddress: this.formBuilder.group(
        {
          street: [''],
          city: [''],
          country: [''],
          state: [''],
          zipCode: [''],
        }),
      creditCard: this.formBuilder.group(
        {
          cardType: [''],
          nameOnCard: [''],
          securityCode: [''],
          expirationMonth: [''],
          expirationYear: [''],
          cardNumber: [''],
        }),
    })

    // populate credit card months and year

    const startMonth: number = new Date().getMonth() + 1;

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(data => {
      console.log("Months: " + JSON.stringify(data));
      this.creditCardMonths = data;
    });

    this.shopFormService.getCreditCardYears().subscribe(data => {
      console.log("Years: " + JSON.stringify(data));
      this.creditCardYears = data;
    });
  }

  onSubmit() {
    console.log("Handling submition");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('customer')?.value.email);
  }

  copyShippingAdressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }

}
