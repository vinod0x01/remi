package com.remi.backend.configuration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
public class SwaggerProperties {

  @Value("${swagger.url}")
  private String url;

  @Value("${swagger.description}")
  private String serverDescription;

  @Value("${swagger.author.name}")
  private String authorName;

  @Value("${swagger.author.email}")
  private String authorEmail;

  @Value("${swagger.info.title}")
  private String title;

  @Value("${swagger.info.version}")
  private String version;

  @Value("${swagger.description}")
  private String description;

  public String getUrl() {
    return url;
  }

  public String getServerDescription() {
    return serverDescription;
  }

  public String getAuthorName() {
    return authorName;
  }

  public String getAuthorEmail() {
    return authorEmail;
  }

  public String getTitle() {
    return title;
  }

  public String getVersion() {
    return version;
  }

  public String getDescription() {
    return description;
  }

  @Override
  public String toString() {
    return "SwaggerProperties{" +
        "url='" + url + '\'' +
        ", serverDescription='" + serverDescription + '\'' +
        ", authorName='" + authorName + '\'' +
        ", authorEmail='" + authorEmail + '\'' +
        ", title='" + title + '\'' +
        ", version='" + version + '\'' +
        ", description='" + description + '\'' +
        '}';
  }
}
