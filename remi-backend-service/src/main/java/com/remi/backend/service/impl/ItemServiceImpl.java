package com.remi.backend.service.impl;

import com.remi.backend.model.Item;
import com.remi.backend.model.Space;
import com.remi.backend.model.dtos.ItemRequest;
import com.remi.backend.repository.ItemRepository;
import com.remi.backend.repository.SpaceRepository;
import com.remi.backend.service.ItemService;
import com.remi.backend.utils.StringOperations;
import com.remi.backend.utils.UserHelper;
import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class ItemServiceImpl implements ItemService {

  @Autowired
  ItemRepository itemRepository;

  @Autowired
  MongoOperations mongoOperations;

  @Autowired
  UserHelper userHelper;

  @Autowired
  SpaceRepository spaceRepository;

  @Autowired
  StringOperations stringOperations;

  @Override
  public Item addItem(ItemRequest itemRequest) {

    Item item = Item.builder()
        .itemName(itemRequest.getItem_name())
        .spaceId(itemRequest.getSpace_id())
        .boxId(itemRequest.getBox_id())
        .imageId(itemRequest.getImage_id())
        .build();

    item = itemRepository.save(item);

    return item;
  }

  @Override
  public Item updateItem(Item item) throws Exception{

    // find item with given ID
    Optional<Item> itemOptional = itemRepository.findByItemID(item.getItem_id());

    if (null == itemOptional){
      String msg = "Item not found with ID: "+item.getItem_id();
      log.error(msg);
      throw new Exception(msg);
    }

    Item item1 = itemOptional.get();

    item1.setItemName(item.getItemName());
    item1.setSpaceId(item.getSpaceId());
    item1.setBoxId(item.getBoxId());
    item1.setImageId(item.getImageId());

    return itemRepository.save(item1);

  }

  @Override
  public String deleteItem(String itemId) {

    Optional<Item> itemOptional = itemRepository.findByItemID(itemId);

    if (null == itemOptional) {
      String msg = "Item with ID : "+itemId+" not present to delete";
      log.warn(msg);
      return msg;
    }

    String item_name = itemOptional.get().getItemName();

    Query query = new Query();
    query.addCriteria(Criteria.where("item_id").is(itemId));
    mongoOperations.remove(query, Item.class);

    String msg = "Item with name : "+item_name+" Deleted";
    log.warn(msg);
    return msg;
  }

  @Override
  public List<Item> searchItem(String itemPattern, HttpServletRequest request) {

    String user_name = userHelper.getUserName(request);

    log.info("searching for user name : "+user_name);

    List<String> spaceIds = spaceRepository.findSpaceIDsForUser(user_name);

    List<String> spaceIds1 = spaceIds.stream()
            .map(str -> {return stringOperations.parseMongoId(str);})
                .collect(Collectors.toList());

    log.info(spaceIds1.toString());

    log.info("Spaces selected for user : "+spaceIds1.size());
    List<Item> items = itemRepository.findByItemNameContainingIgnoreCaseAndSpaceIdIn(itemPattern, spaceIds1);
    if (null == items){return items;}
    log.info("Item size : "+items.size());
    return items;
  }

  @Override
  public List<Item> getSpaceItems(String spaceId) {

    return itemRepository.findBySpaceIdEquals(spaceId);

  }

  @Override
  public List<Item> getBoxItems(String spaceId, int imageId, int boxId) {
    return itemRepository.findItemBySpaceIdEqualsAndImageIdEqualsAndBoxIdEquals(spaceId, imageId, boxId);
  }

  @Override
  public List<Item> getImageItems(String spaceId, int imageId) {
    return itemRepository.findItemBySpaceIdEqualsAndImageIdEquals(spaceId, imageId);
  }
  @Override
  public List<Item> getUserItems(HttpServletRequest request) {

    // find space ids for user
    String user_name = userHelper.getUserName(request);
    log.info("Getting items for user : "+user_name);

    List<String> spaceIds = spaceRepository.findSpaceIDsForUser(user_name);

    List<String> spaceIds1 = spaceIds.stream()
        .map(str -> {return stringOperations.parseMongoId(str);})
        .collect(Collectors.toList());

    log.info("Spaces selected for user : "+spaceIds1.size());

    List<Item> items = itemRepository.findBySpaceIdIn(spaceIds1);

    return items;
  }



  @Override
  public boolean isUserOwnerOrMember(String spaceId, HttpServletRequest request) throws Exception{

    String user_name = userHelper.getUserName(request);

    // check user present as owner or member in space

    Optional<Space> spaceOptional = spaceRepository.findBySpaceID(spaceId);

    if (null == spaceOptional) {
      String msg = "space with id : " + spaceId + " not found";
      log.error(msg);
      throw new Exception(msg);
    }

    return spaceOptional.get().isUserAuthorized(user_name);

  }


}
