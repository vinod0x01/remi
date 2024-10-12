package com.remi.backend.controller;

import com.remi.backend.model.Item;
import com.remi.backend.model.dtos.ItemRequest;
import com.remi.backend.service.ItemService;
import com.remi.backend.utils.UserHelper;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/item", produces = "application/json")
@Slf4j
public class ItemController {

  @Autowired
  UserHelper userHelper;

  @Autowired
  ItemService itemService;

  @PostMapping("/add")
  public ResponseEntity addItem(@RequestBody ItemRequest itemRequest, HttpServletRequest request){

    log.info("Adding Item");

    try {

      if (!itemService.isUserOwnerOrMember(itemRequest.getSpace_id(), request)){
        log.error("User not permitted to add to this space");
        throw new Exception("User is not a member or Owner to add item to space "+itemRequest.getSpace_id());
      }

      Item item = itemService.addItem(itemRequest);

      return ResponseEntity.status(HttpStatus.OK).body(item);

    }catch (Exception e){

      String msg = "Not able to add Item : "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }
  }

  @PostMapping("/update")
  public ResponseEntity updateItem(@RequestBody Item item, HttpServletRequest request){

    try {

      if (!itemService.isUserOwnerOrMember(item.getSpaceId(), request)){
        throw new Exception("User is not a member or Owner to update item to space "+item.getSpaceId());
      }

      Item item1 = itemService.updateItem(item);

      return ResponseEntity.status(HttpStatus.OK).body(item1);

    }catch (Exception e){

      String msg = "Not able to update Item : "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }

  }

  @PostMapping("/delete")
  public ResponseEntity deleteItem(@RequestParam("item_id") String item_id, @RequestParam("space_id") String space_id, HttpServletRequest request){

    try{
      if (!itemService.isUserOwnerOrMember(space_id, request)){
        throw new Exception("User is not a member or Owner to detele item to space "+space_id);
      }
      String msg = itemService.deleteItem(item_id);
      return ResponseEntity.status(HttpStatus.OK).body(msg);
    }catch (Exception e){

      String msg = "Not able to delete Item : "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }

  }

  @GetMapping("/search")
  public ResponseEntity searchItem(@RequestParam("item_name") String itemName, HttpServletRequest request) {

    log.info("searching for "+itemName);

    try {

      List<Item> itemList = itemService.searchItem(itemName, request);

      log.info("Items fetched : "+itemList.size());

      return ResponseEntity.status(HttpStatus.OK).body(itemList);

    }catch (Exception e){
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("");
    }

  }

  @GetMapping("/spaceitems")
  public ResponseEntity getSpaceItems(@RequestParam("space_id") String spaceId, HttpServletRequest request){
    try {
      if (!itemService.isUserOwnerOrMember(spaceId, request)){
        throw new Exception("User is not a member or Owner to list the items of space");
      }

      List<Item> items = itemService.getSpaceItems(spaceId);

      return ResponseEntity.status(HttpStatus.OK).body(items);

    }catch (Exception e) {
      String msg = "not able to get items "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }
  }

  @GetMapping("/boxitems")
  public ResponseEntity getBoxItems(@RequestParam("space_id") String spaceId, @RequestParam("image_id") int imageId, @RequestParam("box_id") int boxId,HttpServletRequest request){
    try {
      if (!itemService.isUserOwnerOrMember(spaceId, request)){
        throw new Exception("User is not a member or Owner to list the items of space");
      }

      List<Item> items = itemService.getBoxItems(spaceId, imageId, boxId);

      return ResponseEntity.status(HttpStatus.OK).body(items);

    }catch (Exception e) {
      String msg = "not able to get items "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }
  }

  @GetMapping("/imageitems")
  public ResponseEntity getImageItems(@RequestParam("space_id") String spaceId, @RequestParam("image_id") int imageId, HttpServletRequest request){
    try {
      if (!itemService.isUserOwnerOrMember(spaceId, request)){
        throw new Exception("User is not a member or Owner to list the items of space");
      }

      List<Item> items = itemService.getImageItems(spaceId, imageId);

      return ResponseEntity.status(HttpStatus.OK).body(items);

    } catch (Exception e) {
      String msg = "not able to get items for image : "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }
  }

  @GetMapping("/all")
  public ResponseEntity getUserItems(HttpServletRequest request){

    try{
      List<Item> items = itemService.getUserItems(request);
      return ResponseEntity.status(HttpStatus.OK).body(items);
    }catch (Exception e) {
      String msg = "Not able to fetch the user items : "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.OK).body(msg);
    }

  }


}
