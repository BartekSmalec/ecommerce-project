package com.bartek.ecommerce.service;

import com.bartek.ecommerce.dto.PaymentInfo;
import com.bartek.ecommerce.dto.Purchase;
import com.bartek.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
    PurchaseResponse placeOrder(Purchase purchase);
    PaymentIntent createPaymentInfo(PaymentInfo paymentInfo) throws StripeException;
}
