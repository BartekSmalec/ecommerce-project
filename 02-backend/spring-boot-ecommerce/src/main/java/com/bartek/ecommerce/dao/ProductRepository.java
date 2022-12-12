package com.bartek.ecommerce.dao;

import com.bartek.ecommerce.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Query method look for spring boot doc
    // Link in api localhost:8080/api/products/search/findByCategoryId?id=2
    Page<Product> findByCategoryId(@Param("id") Long id, Pageable pageable);

    // http://localhost:8080/api/products/search/findByNameContaining?name=python
    Page<Product> findByNameContaining(@Param("name") String name, Pageable pageable);
}
