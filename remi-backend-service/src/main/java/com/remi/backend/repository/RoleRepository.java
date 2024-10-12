package com.remi.backend.repository;

import com.remi.backend.model.Role;
import com.remi.backend.Constants.ERole;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoleRepository extends MongoRepository<Role, String> {

  Optional<Role> findByName(ERole name);

}
