package com.remi.backend.repository;

import com.remi.backend.model.User;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
  Optional<User> findByUsername(String username);
  Optional<User> findById(String id);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);
}
