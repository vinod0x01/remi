package com.remi.backend.service;

import com.remi.backend.model.Item;
import com.remi.backend.model.dtos.ItemRequest;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

public interface ItemService {

  public Item addItem(ItemRequest itemRequest);

  public Item updateItem(Item item) throws Exception;

  public String deleteItem(String itemId);

  public List<Item> searchItem(String itemPattern, HttpServletRequest request);

  public boolean isUserOwnerOrMember(String spaceId, HttpServletRequest request) throws Exception;

  public List<Item> getSpaceItems(String spaceId);

  public List<Item> getBoxItems(String spaceId, int imageId, int boxId);

  public List<Item> getUserItems(HttpServletRequest request);

  public List<Item> getImageItems(String spaceId, int imageId);

}
