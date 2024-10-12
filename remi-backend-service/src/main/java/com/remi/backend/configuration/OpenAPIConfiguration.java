package com.remi.backend.configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfiguration {

  @Autowired
  SwaggerProperties swaggerProperties;

  @Bean
  public OpenAPI defineOpenApi() {

    Server server = new Server();
    server.setUrl(swaggerProperties.getUrl());
    server.setDescription(swaggerProperties.getServerDescription());

    Contact myContact = new Contact();
    myContact.setName(swaggerProperties.getAuthorName());
    myContact.setEmail(swaggerProperties.getAuthorEmail());

    Info info = new Info()
        .title(swaggerProperties.getTitle())
        .version(swaggerProperties.getVersion())
        .description(swaggerProperties.getDescription())
        .contact(myContact);

    return new OpenAPI().info(info).servers(List.of(server));

  }

}
