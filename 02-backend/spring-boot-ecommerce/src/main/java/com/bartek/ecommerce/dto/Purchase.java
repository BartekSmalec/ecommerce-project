package com.bartek.ecommerce.dto;

import com.bartek.ecommerce.entity.Address;
import com.bartek.ecommerce.entity.Customer;
import com.bartek.ecommerce.entity.Order;
import com.bartek.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
