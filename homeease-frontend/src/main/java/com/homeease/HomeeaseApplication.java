package com.homeease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class HomeeaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(HomeeaseApplication.class, args);
	}

	@Configuration
	public class WebConfig implements WebMvcConfigurer {
		@Override
		public void addResourceHandlers(ResourceHandlerRegistry registry) {
			registry.addResourceHandler("/uploads/**")
					.addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/");
		}
	}
}	
