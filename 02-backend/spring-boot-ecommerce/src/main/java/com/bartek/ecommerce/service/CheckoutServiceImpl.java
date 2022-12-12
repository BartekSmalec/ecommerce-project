package com.bartek.ecommerce.service;

import com.bartek.ecommerce.dao.CustomerRepository;
import com.bartek.ecommerce.dto.Purchase;
import com.bartek.ecommerce.dto.PurchaseResponse;
import com.bartek.ecommerce.entity.Customer;
import com.bartek.ecommerce.entity.Order;
import com.bartek.ecommerce.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService{

    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository)
    {
        this.customerRepository = customerRepository;
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

    private String generateOrderTrackignNumber() {
        // generate a random UUID
        return UUID.randomUUID().toString();
    }
}
