package com.remi.backend.repository;

import com.remi.backend.model.UserSpace;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserSpaceRepository extends MongoRepository<UserSpace, String> {

}
