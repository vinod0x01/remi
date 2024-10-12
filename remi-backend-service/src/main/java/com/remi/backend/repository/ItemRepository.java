package com.remi.backend.repository;

import com.remi.backend.model.Item;
import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends MongoRepository<Item, String> {

  @Query("{ 'item_id' :  ?0 }")
  Optional<Item> findByItemID(String itemID);

  List<Item> findByItemNameContainingIgnoreCaseAndSpaceIdIn(String itemName, List<String> spaceIds);

  List<Item> findBySpaceIdEquals(String spaceId);

  List<Item> findBySpaceIdEqualsAndBoxIdEquals(String spaceId, int boxId);

  List<Item> findItemBySpaceIdEqualsAndImageIdEquals(String spaceId, int ImageId);

  List<Item> findItemBySpaceIdEqualsAndImageIdEqualsAndBoxIdEquals(String spaceId, int imageId, int boxId);


  List<Item> findBySpaceIdIn(List<String> spaceIds);

}
