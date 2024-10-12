package com.remi.backend.repository;

import com.remi.backend.model.UserCollection;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestUserRepository extends MongoRepository<UserCollection, Long> {

}
