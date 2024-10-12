package com.remi.backend.service.impl;

import com.remi.backend.model.UserSpace;
import com.remi.backend.repository.UserSpaceRepository;
import com.remi.backend.service.UserSpaceService;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserSpaceServiceImpl implements UserSpaceService {

  @Autowired
  UserSpaceRepository userSpaceRepository;

  @Override
  public void addToUSerSpace(String userId, String spaceId) {

    Optional<UserSpace> userSpace1 = userSpaceRepository.findById(userId);

    if (userSpace1 == null) {

      UserSpace userSpace = new UserSpace();
      userSpace.setUser(userId);
      List<String> spaceList = new LinkedList<>();
      spaceList.add(spaceId);
      userSpace.setSpaces(spaceList);
      userSpaceRepository.save(userSpace);

    }
    UserSpace userSpace = userSpace1.get();
    userSpace.appendSpace(spaceId);
    userSpaceRepository.save(userSpace);
  }
}
