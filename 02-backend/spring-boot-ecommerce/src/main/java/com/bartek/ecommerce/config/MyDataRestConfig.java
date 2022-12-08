package com.bartek.ecommerce.config;

import com.bartek.ecommerce.entity.Country;
import com.bartek.ecommerce.entity.Product;
import com.bartek.ecommerce.entity.ProductCategory;
import com.bartek.ecommerce.entity.State;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);

        HttpMethod[] theUnupportedAction = { HttpMethod.PUT, HttpMethod.POST,HttpMethod.DELETE};

        // disable HTTP method for Product: PUT, POST, DELETE
        disableHttpMethods(Product.class, config, theUnupportedAction);
        disableHttpMethods(ProductCategory.class,config, theUnupportedAction);
        disableHttpMethods(Country.class,config, theUnupportedAction);
        disableHttpMethods(State.class,config, theUnupportedAction);

        exposeIds(config);

    }

    private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnupportedAction) {
        config.getExposureConfiguration()
                .forDomainType(theClass)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(theUnupportedAction))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(theUnupportedAction));
    }

    private void exposeIds(RepositoryRestConfiguration config)
    {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        List<Class> entityClasses = new ArrayList<>();

        for(EntityType tempEntityType: entities)
        {
            entityClasses.add(tempEntityType.getJavaType());
        }

        Class[] domainType =  entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainType);
    }
}
