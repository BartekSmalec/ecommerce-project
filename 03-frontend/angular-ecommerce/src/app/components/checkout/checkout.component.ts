import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { JsonPipe } from '@angular/common';
import { toJSDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

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
          cardNumber: [''],
          securityCode: [''],
          expirationMonth: [''],
          expirationYear: ['']
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


    this.shopFormService.getCountries().subscribe(data => {
      console.log("Countires: " + JSON.stringify(data));
      this.countries = data;
    })
  }

  onSubmit() {
    console.log("Handling submition");
    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(this.checkoutFormGroup.get('customer')?.value.email);
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
