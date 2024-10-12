package com.remi.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.remi.backend.model.TestGroceryItem;
import com.remi.backend.repository.TestItemRepository;
import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class TestService {

  @Autowired
  TestItemRepository testItemRepository;

  @Value("${test_data_files.test_item}")
  String item_json_path;

  public TestGroceryItem[] readGrocerryItemsFromJSon() throws IOException {
    ObjectMapper objectMapper = new ObjectMapper();

      TestGroceryItem[] testGroceryItemList = objectMapper.readValue(new File(item_json_path), TestGroceryItem[].class);

      log.info("DataRed" + testGroceryItemList.toString());

      return testGroceryItemList;
  }

  public void seedData() throws IOException {

    TestGroceryItem[] testGroceryItems = readGrocerryItemsFromJSon();

    testItemRepository.saveAll(Arrays.asList(testGroceryItems));

  }

}
