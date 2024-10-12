package com.remi.backend.service.impl;

import com.remi.backend.model.Space;
import com.remi.backend.model.User;
import com.remi.backend.model.dtos.AddMemberRequest;
import com.remi.backend.model.dtos.Box;
import com.remi.backend.model.dtos.Coordinate;
import com.remi.backend.model.dtos.FinalizedBoxesRequest;
import com.remi.backend.model.dtos.SpaceImage;
import com.remi.backend.model.dtos.WireFrameResponse;
import com.remi.backend.repository.SpaceRepository;
import com.remi.backend.repository.UserRepository;
import com.remi.backend.service.SpaceService;
import com.remi.backend.service.UserSpaceService;
import com.remi.backend.utils.FileOperations;
import com.remi.backend.utils.StringOperations;
import com.remi.backend.utils.UserHelper;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.bson.json.JsonObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@Slf4j
public class SpaceServiceImpl implements SpaceService {

  @Autowired
  SpaceRepository spaceRepository;

  @Autowired
  UserRepository userRepository;
  @Autowired
  UserSpaceService userSpaceService;

  @Value("${app.upload_path}")
  String UPLOAD_DIR;

  @Autowired
  UserHelper userHelper;

  @Autowired
  FileOperations fileOperations;

  @Autowired
  FeignClientUtilService feignClientUtilService;

  @Autowired
  MongoOperations mongoOperations;

  @Autowired
  StringOperations stringOperations;

  @Override
  public List<Space> getSpaces(HttpServletRequest request) throws Exception {
    
    // get userID
    String userName = userHelper.getUserName(request);
//    Optional<User> userOptional = userRepository.findByUsername(userName);

    if (null == userName) {
      String message = "Not able to fetch user";
      log.error(message+" "+userName);
      throw new Exception(message);
    }
    log.info("sarching spaces for user with name : "+userName);

    // search for spaces for that user
    List<Space> spaces = spaceRepository.findSpacesForUser(userName);

//    List<String> spaceIds = spaceRepository.findSpaceIDsForUser(userName);
//    log.info(String.valueOf(spaceIds));

    log.info("Total spaces found : "+spaces.size());
    
    return spaces;
  }

  @Override
  public Space addSpace(String spaceName, String userName) throws Exception {
    Space space = new Space(spaceName, userName);
    space = spaceRepository.save(space);
    return space;
  }

  @Override
  public Space uploadImages(String spaceId, String userName, MultipartFile[] files) throws Exception {


    log.info("uploading images");

    List<String> base64Images = new ArrayList<>();

    String uploadPath = UPLOAD_DIR + "/" + userName + "/";
    try {
      for (MultipartFile file : files) {
        if (file.isEmpty()) {
          String message = "Invalid Image";
          log.error(message);
          throw new Exception(message);
        }

        try {

          Path path1 = Paths.get(uploadPath);
          if (!Files.exists(path1)) {
            Files.createDirectories(path1);
          }

          Path filePath = path1.resolve(file.getOriginalFilename());
          Files.copy(file.getInputStream(), filePath);

          byte[] fileBytes = Files.readAllBytes(filePath);
          String base64String = Base64.getEncoder().encodeToString(fileBytes);
          base64Images.add(base64String);

        } catch (IOException e) {
          throw new RuntimeException(e);
        }

      }

      log.info("Convertion to base64 of images succcess");

      Optional<Space> spaceOpt = spaceRepository.findBySpaceID(spaceId);

      if (null == spaceOpt) {
        String message = "Space with " + spaceId + " not found";
        log.error(message);
        throw new Exception(message);
      }

      Space space = spaceOpt.get();

      log.info(space.toString());

      for (String img : base64Images) {
        SpaceImage spaceImage = new SpaceImage(img);
        space.addSpaceImage(spaceImage);
      }

      log.info("Added image to space");
      space = spaceRepository.save(space);
      return space;
    }
    catch (Exception e){
      throw new Exception(e.getMessage());
    }
    finally {
      fileOperations.deleteDirectory(uploadPath);
    }

  }

  @Override
  public WireFrameResponse detectBoxes(String base64Image) {

    log.info("In detection boxes in SpaceServiceImpl");

    return feignClientUtilService.callExternalServiceDetectBoxes(base64Image);

  }

  @Override
  public Space detectBoxForSpace(Space space) throws Exception {

    log.info("Getting box details from endpoint : ${wireframe.baseurl}${wireframe.boxdetection.endpoint}");

    if (null == space) {
      throw new Exception("Space is null for decting boxes");
    }

    List<SpaceImage> spaceImages = new ArrayList<>();

    for (SpaceImage spaceImage: space.getSpace_images()) {
      WireFrameResponse wireFrameResponse = detectBoxes(spaceImage.getSpace_image());

      List<List<Coordinate>> initialBoxes = new ArrayList<>();

      for (List<List<Integer>> coordinate: wireFrameResponse.getCoordinates()) {
        List<Coordinate> boxPoints = new ArrayList<>();
        Coordinate c1 = new Coordinate(coordinate.get(0).get(0), coordinate.get(0).get(1));
        Coordinate c2 = new Coordinate(coordinate.get(1).get(0), coordinate.get(1).get(1));
        boxPoints.add(c1);
        boxPoints.add(c2);
        initialBoxes.add(boxPoints);
      }

      spaceImage.setInitial_boxes_coordinates(initialBoxes);
      spaceImage.setSpace_image(wireFrameResponse.getImage());

      spaceImages.add(spaceImage);
    }

    space.setSpace_images(spaceImages);

    return spaceRepository.save(space);

  }

  @Override
  public Space finalisedBoxDetails(FinalizedBoxesRequest finalizedBoxesRequest) throws Exception {

    log.info("adding finalised box to space"+finalizedBoxesRequest.getImage_id());
    Optional<Space> spaceOptional = spaceRepository.findById(finalizedBoxesRequest.getSpace_id());

    if (null == spaceOptional) {
      String message = "Space with id : "+finalizedBoxesRequest.getSpace_id()+" Not present";
      log.error(message);
      throw new Exception(message);
    }

    Space space = spaceOptional.get();

    List<SpaceImage> spaceImages = space.getSpace_images();

    spaceImages.stream()
        .filter(spaceImage -> spaceImage.getId().equals(finalizedBoxesRequest.getImage_id()))
        .findFirst()
        .ifPresent(spaceImage -> {
//          int boxID = 1;
//          if (null != spaceImage.getFinalized_boxes()) {
//            if (spaceImage.getFinalized_boxes().size() > 0) {
//              boxID += spaceImage.getFinalized_boxes().size();
//            }
//          }

          Box box = Box.builder()
              .box_id(finalizedBoxesRequest.getBox_id())
              .box_name(finalizedBoxesRequest.getBox_name())
              .coordinates(finalizedBoxesRequest.getCoordinates())
              .build();

          spaceImage.addFinalizedBox(box);

        });

    space.setSpace_images(spaceImages);

    space = spaceRepository.save(space);

    return space;
  }


  @Override
  public Space finalisedBoxDetails(List<FinalizedBoxesRequest> finalizedBoxesRequests) throws Exception {

    if (null == finalizedBoxesRequests || finalizedBoxesRequests.size() == 0) {
      throw new Exception("No Boxes to add empty box list");
    }

    Space space = null;

    for (FinalizedBoxesRequest finalizedBoxesRequest: finalizedBoxesRequests) {

      log.info("adding finalised box to space" + finalizedBoxesRequest.getImage_id());

      if (space == null) {

        Optional<Space> spaceOptional = spaceRepository.findById(
            finalizedBoxesRequest.getSpace_id());

        if (null == spaceOptional) {
          String message =
              "Space with id : " + finalizedBoxesRequest.getSpace_id() + " Not present";
          log.error(message);
          throw new Exception(message);
        }

        space = spaceOptional.get();
      }

      List<SpaceImage> spaceImages = space.getSpace_images();

      spaceImages.stream()
          .filter(spaceImage -> spaceImage.getId().equals(finalizedBoxesRequest.getImage_id()))
          .findFirst()
          .ifPresent(spaceImage -> {

            Box box = Box.builder()
                .box_id(finalizedBoxesRequest.getBox_id())
                .box_name(finalizedBoxesRequest.getBox_name())
                .coordinates(finalizedBoxesRequest.getCoordinates())
                .build();

            spaceImage.addFinalizedBox(box);

          });

      space.setSpace_images(spaceImages);
    }

    space = spaceRepository.save(space);

    return space;
  }

  public Space getSpace(String spaceId){
    Optional<Space> spaceOptional = spaceRepository.findBySpaceID(spaceId);
    if (null == spaceOptional) {
      String msg = "Not able to find the sapce for requested ID : "+spaceId;
      log.error(msg);
    }
    Space space = spaceOptional.get();

    return space;
  }

  public String deleteSpace(String spaceId, HttpServletRequest request) throws Exception {

    String user_name=  userHelper.getUserName(request);

    Optional<Space> spaceOptional = spaceRepository.findBySpaceID(spaceId);

    String msg = "";

    if (null == spaceOptional) {
      msg = "space is not present with ID : "+spaceId;
      log.warn(msg);
      return msg;
    }

    String owner_id = spaceOptional.get().getOwner_id();

    log.info("Owner name is : "+owner_id);

    if (user_name.equals(owner_id)) {

      String space_name = spaceOptional.get().getSpace_name();
      spaceOptional = null;

      Query query = new Query();
      query.addCriteria(Criteria.where("space_id").is(spaceId));
      mongoOperations.remove(query, Space.class);

      msg = "space with " + space_name + " deleted";
      log.warn(msg);
      return msg;
    }
    else {
      msg = "user : "+user_name+" don't have a persmission to delete the space";
      log.error(msg);
      throw new Exception(msg);
    }
  }

  @Override
  public Map<String, String> searchUser(String userName) throws Exception {
    Optional<User> userOptional = userRepository.findByUsername(userName);

    if (null == userOptional) {
      String message = "user with user name "+userName+" not found";
      log.warn(message);
      throw new Exception(message);
    }

    Map<String, String> map = new HashMap<>();
    map.put("user_name", userOptional.get().getUsername());
    map.put("user_id", userOptional.get().getId());

    return map;

  }

  @Override
  public Space addMemberToSpace(AddMemberRequest addMemberRequest, HttpServletRequest request) throws Exception {

    String currentUser = userHelper.getUserName(request);

    log.info("Current user: "+currentUser);


    if (!isOwner(addMemberRequest.getSpace_id(), currentUser)) {
      throw new Exception("Other users can't add the members only owner can add");
    }


    // get the space
    Optional<Space> spaceOptional = spaceRepository.findBySpaceID(addMemberRequest.getSpace_id());

    if (null == spaceOptional) {
      String message = "Invalid Space ID";
      log.error(message+" "+addMemberRequest.getSpace_id());
      throw new Exception(message);
    }

    Space space = spaceOptional.get();

    space.addMember(addMemberRequest.getUser_name());

    space = spaceRepository.save(space);

    return space;

  }

  public boolean isOwner(String spaceId, String userID) {

    String ownerMap = spaceRepository.getOwnerNameForSpaceID(spaceId);
    log.info("Owner Json : "+ownerMap);
    Document document = Document.parse(ownerMap);
    String ownerName = document.getString("owner_id");
    log.info("Owner Name : "+ownerName);

    return ownerName.equals(userID);

  }
  @Override
  public Space deleteMemberFromSpace(String spaceId, String memberId, HttpServletRequest request) throws Exception{

    String currentUser = userHelper.getUserName(request);

    log.info("Current user: "+currentUser);


    if (!isOwner(spaceId, currentUser)) {
      throw new Exception("Other users can't delete the members only owner can delete");
    }


    Query query = new Query();
    query.addCriteria(Criteria.where("space_id").is(spaceId));

    Update update = new Update().pull("memberids", memberId);
    mongoOperations.updateFirst(query, update, Space.class);

    Optional<Space> space = spaceRepository.findBySpaceID(spaceId);

    if (null == space) {
      throw new Exception("Not able to get the space");
    }

    return space.get();

  }

  @Override
  public Space updateOwnerForSpace(String spaceID, String newOwnerId, HttpServletRequest request) throws Exception{

    String currentUser = userHelper.getUserName(request);

    // check owner
    Optional<Space> spaceOptional = spaceRepository.findBySpaceID(spaceID);

    if (null == spaceOptional) {
      throw new Exception("no space with id : "+spaceID);
    }

    Space space = spaceOptional.get();

    String owner_name = space.getOwner_id();

    if (!owner_name.equals(currentUser)){
      throw new Exception("Only owner can change the owner not others");
    }

    space.setOwner_id(newOwnerId);

    Space newspace = spaceRepository.save(space);

    return newspace;

  }


}

