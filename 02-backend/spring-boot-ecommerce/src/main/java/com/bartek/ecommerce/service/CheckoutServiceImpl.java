package com.bartek.ecommerce.service;

import com.bartek.ecommerce.dao.CustomerRepository;
import com.bartek.ecommerce.dto.PaymentInfo;
import com.bartek.ecommerce.dto.Purchase;
import com.bartek.ecommerce.dto.PurchaseResponse;
import com.bartek.ecommerce.entity.Customer;
import com.bartek.ecommerce.entity.Order;
import com.bartek.ecommerce.entity.OrderItem;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository ,@Value("${stripe.key.secret}") String secretKey)
    {
        this.customerRepository = customerRepository;

        // init stripe API with secret key
        Stripe.apiKey = secretKey;
    }
    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {
        // retrieve the order info from dto
        Order order =  purchase.getOrder();

        // generate tracking number
        String orderTrackingNumber = generateOrderTrackignNumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // populate order with orderItems;
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

        // populate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());
        // populate customer with order

        Customer customer = purchase.getCustomer();

        // check if this is an existing customer

        String theEmail = customer.getEmail();

        Customer customerFromDB =  customerRepository.findByEmail(theEmail);

        if(customerFromDB != null)
        {
            customer = customerFromDB;
        }

        customer.add(order);

        // save to the database
        customerRepository.save(customer);
        // return a response
        return new PurchaseResponse(orderTrackingNumber);
    }

    @Override
    public PaymentIntent createPaymentIntent(PaymentInfo paymentInfo) throws StripeException {
        List<String> paymentMethodTypes = new ArrayList<>();
        paymentMethodTypes.add("card");

        Map<String, Object> params =  new HashMap<>();
        params.put("amount", paymentInfo.getAmount());
        params.put("currency", paymentInfo.getCurrency());
        params.put("payment_method_types", paymentMethodTypes);
        params.put("description", "spring-boot-ecommerce purchase");
        params.put("receipt_email", paymentInfo.getReceiptEmail());
        return PaymentIntent.create(params);
    }

    private String generateOrderTrackignNumber() {
        // generate a random UUID
        return UUID.randomUUID().toString();
    }
}
