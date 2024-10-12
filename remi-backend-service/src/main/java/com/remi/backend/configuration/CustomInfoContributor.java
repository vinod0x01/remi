package com.remi.backend.configuration;

import org.springframework.boot.actuate.info.Info.Builder;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

@Component
public class CustomInfoContributor implements InfoContributor {

  @Override
  public void contribute(Builder builder) {
    builder.withDetail("App name", "Remi Backend Service")
        .withDetail("Status", "Running");
  }
}
