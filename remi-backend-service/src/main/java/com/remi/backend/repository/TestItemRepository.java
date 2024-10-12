package com.remi.backend.repository;

import com.remi.backend.model.TestGroceryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestItemRepository extends MongoRepository<TestGroceryItem, String> {

}
