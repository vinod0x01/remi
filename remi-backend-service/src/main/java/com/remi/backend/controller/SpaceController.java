package com.remi.backend.controller;

import com.remi.backend.model.Space;
import com.remi.backend.model.dtos.AddMemberRequest;
import com.remi.backend.model.dtos.FinalizedBoxesRequest;
import com.remi.backend.security.jwt.JwtUtils;
import com.remi.backend.service.SpaceService;
import com.remi.backend.utils.UserHelper;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.apache.http.protocol.HTTP;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.autoconfigure.observation.ObservationProperties.Http;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping(path = "/api/space", produces = "application/json")
@Slf4j
public class SpaceController {

  @Autowired
  SpaceService spaceService;

  @Autowired
  JwtUtils jwtUtils;

  @Value("${app.upload_path}")
  String UPLOAD_DIR;

  @Autowired
  UserHelper userHelper;

  @GetMapping("/getspaces")
  public ResponseEntity getSpaces(HttpServletRequest request){
    try {

      List<Space> spaces = spaceService.getSpaces(request);

      return ResponseEntity.status(HttpStatus.OK).body(spaces);

    }
    catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not able to fetch spaces...\n"+e.getMessage());
    }
  }

  @PostMapping(path = "/addspace")
  public ResponseEntity addSpace(@RequestParam("space_name") String spacename, HttpServletRequest request) {

    try{

      String userName = userHelper.getUserName(request);
      Space space = spaceService.addSpace(spacename, userName);
      return ResponseEntity.ok(space);
    } catch (Exception e){
      return new ResponseEntity(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

  }

  @PostMapping(path = "/uploadimages")
  public ResponseEntity uploadImages(@RequestParam("space_id") String spaceid, @RequestParam("files")MultipartFile[] files, HttpServletRequest request){

    if (files.length == 0) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No images passed");
    }

    try {

      Space space = spaceService.uploadImages(spaceid, userHelper.getUserName(request), files);

      space = spaceService.detectBoxForSpace(space);

      return ResponseEntity.status(HttpStatus.OK).body(space);

    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }

  }

  @PostMapping("/addbox")
  public ResponseEntity addFinalizedBox(@RequestBody List<FinalizedBoxesRequest> finalizedBoxesRequests){

    try {

      Space space = spaceService.finalisedBoxDetails(finalizedBoxesRequests);

      return ResponseEntity.status(HttpStatus.OK).body(space);

    }
    catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Not able to save the box details");
    }
  }

  @PostMapping("/searchuser")
  public ResponseEntity searchUser(@RequestParam("user_name") String userName) {

    try {
      return ResponseEntity.status(HttpStatus.OK).body(spaceService.searchUser(userName));
    }catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid user id");
    }

  }

  @PostMapping("/addspacemember")
  public ResponseEntity addMemberToSpace(@RequestBody AddMemberRequest addMemberRequest, HttpServletRequest request){
    try {
      // call here
      Space space = spaceService.addMemberToSpace(addMemberRequest, request);

      return ResponseEntity.status(HttpStatus.OK).body(space);

    } catch (Exception e) {
      String message = "Not able to add the member "+e.getMessage();
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
    }
  }

  @DeleteMapping("/deletespace")
  public ResponseEntity deleteSpace(@RequestParam("space_id") String space_id, HttpServletRequest request){
    String msg = "";
    try {
      msg = spaceService.deleteSpace(space_id, request);
      log.info(msg);
      return ResponseEntity.status(HttpStatus.OK).body(msg);
    }catch (Exception e){
      msg = "unable to delete space id : "+space_id+" "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }

  }

  @DeleteMapping("/deletemember")
  public ResponseEntity deleteMember(@RequestParam("space_id") String spaceId, @RequestParam("member_id") String memberId, HttpServletRequest request){

    try {
      Space space = spaceService.deleteMemberFromSpace(spaceId, memberId, request);
      return ResponseEntity.status(HttpStatus.OK).body(space);
    }catch (Exception e){
      String msg = "delete member failed "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }

  }

  @PostMapping("/updateowner")
  public ResponseEntity updateOwner(@RequestParam("space_id") String spaceId, @RequestParam("new_owner_id") String newOwnerId, HttpServletRequest request){

    try {
      Space space = spaceService.updateOwnerForSpace(spaceId, newOwnerId, request);

      return ResponseEntity.status(HttpStatus.OK).body(space);

    }catch (Exception e){
      String msg = "owner member failed "+e.getMessage();
      log.error(msg);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(msg);
    }

  }

}
