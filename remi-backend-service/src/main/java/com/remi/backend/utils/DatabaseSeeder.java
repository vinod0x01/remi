package com.remi.backend.utils;

import com.remi.backend.Constants.ERole;
import com.remi.backend.model.Role;
import com.remi.backend.repository.RoleRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DatabaseSeeder {

  @Autowired
  private RoleRepository roleRepository;

  @Bean
  CommandLineRunner seedDatabase() {
    return args -> {
      log.info("Starting initial seeding to database....");
      List<Role> roles = new ArrayList<>();

      for (ERole role : ERole.values()) {
        Role roleObject = new Role();
        roleObject.setName(role);
        roles.add(roleObject);
      }
      log.info("Seeding total : "+roles.size()+" values");
      for (Role role : roles) {
        roleRepository.save(role);
      }

    };
  }

}
