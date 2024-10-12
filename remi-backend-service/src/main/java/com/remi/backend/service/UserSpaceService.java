package com.remi.backend.service;

import com.remi.backend.model.Space;
import com.remi.backend.model.User;

public interface UserSpaceService {

  void addToUSerSpace(String userId, String spaceId);

}
