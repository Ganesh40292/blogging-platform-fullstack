package com.blog.bloggingplatform.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.servlet.Filter;

@Configuration
public class FilterConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public FilterRegistrationBean<Filter> jwtFilterRegistration() {
        FilterRegistrationBean<Filter> registration = new FilterRegistrationBean<>();
        registration.setFilter(jwtFilter);
        registration.addUrlPatterns("/api/*"); // apply to all APIs
        return registration;
    }
}