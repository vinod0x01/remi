package com.remi.backend.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class StringOperations {

  public String parseMongoId(String input){
    // Regular expression to match the ObjectId
    String regex = "\"\\$oid\": \"([0-9a-fA-F]*)\""; // Matches the ObjectId pattern
    Pattern pattern = Pattern.compile(regex);
    Matcher matcher = pattern.matcher(input);

    if (matcher.find()) {
      // Extract the ObjectId
      String objectId = matcher.group(1);
      log.info("After parsing : "+objectId);
      return objectId;
    }
    return input;
  }

  public String parseOwnerId(String input){
    // Regular expression to match the ObjectId
    String regex = "\"\\$owner_id\": \"([0-9a-fA-F]*[_-]*[0-9a-fA-F])\""; // Matches the ObjectId pattern
    Pattern pattern = Pattern.compile(regex);
    Matcher matcher = pattern.matcher(input);

    if (matcher.find()) {
      // Extract the ObjectId
      String objectId = matcher.group(1);
      log.info("After parsing : "+objectId);
      return objectId;
    }
    return input;
  }

}
