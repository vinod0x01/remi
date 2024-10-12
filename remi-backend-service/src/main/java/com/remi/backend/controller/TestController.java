package com.remi.backend.controller;


import com.remi.backend.model.dtos.GenericResponse;
import com.remi.backend.configuration.SwaggerProperties;
import com.remi.backend.service.TestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path="/api/test", produces = "application/json")
@Slf4j
public class TestController {

  @Autowired
  TestService testService;

  @Autowired
  SwaggerProperties swaggerProperties;

  @Tag(name="Swagger GET", description = "Get Methods for Test Swagger APIS")
  @Operation(summary = "Get current profile swagger configurations",
              description = "return json swagger configurations")
  @ApiResponse(responseCode = "200", content = {
      @Content( mediaType = "application/json",
                schema = @Schema(implementation = SwaggerProperties.class))})
  @GetMapping("/swagger/props")
  public SwaggerProperties getSwaggerProperties() {
    log.info(swaggerProperties.getUrl());
    return swaggerProperties;
  }

  @Tag(name="Swagger GET", description = "Get Methods for Test Swagger APIS")
  @Operation(summary = "Get current profile swagger author configurations",
      description = "return json swagger author configurations")
  @GetMapping("/swagger/author/{randString}")
  public SwaggerProperties getAutherDetails(@Parameter(
      description = "some random string",
      required = true)
      @PathVariable String randString) {
    log.info(randString);
    return swaggerProperties;
  }

  @Tag(name = "Item POST", description = "Post methods for test seed data")
  @Operation( summary = "Take the json data and seed to the mongo",
              description = "seed josn data to mongo")
  @ApiResponse(responseCode = "200", content = {@Content(mediaType = "application/json",
                schema = @Schema(implementation = GenericResponse.class))})
  @PostMapping(path = "/items/seed")
  public ResponseEntity seedTestItemsData(){

    try {
      testService.seedData();
    }
    catch (IOException ie) {
      log.error(ie.getMessage());
      ie.printStackTrace();
      return new ResponseEntity(HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity(HttpStatus.OK);

  }

}
