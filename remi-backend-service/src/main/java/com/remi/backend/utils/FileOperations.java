package com.remi.backend.utils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FileOperations {

  public void deleteDirectory(String dirPath) throws IOException {
    Path directory = Paths.get(dirPath);

    // Check if the directory exists
    if (Files.exists(directory)) {
      // Walk through the directory and delete all files and subdirectories
      Files.walk(directory)
          .sorted(Comparator.reverseOrder()) // Sort in reverse order to delete files before directories
          .forEach(path -> {
            try {
              Files.delete(path);
            } catch (IOException e) {
              log.error("Failed to delete " + path + ": " + e.getMessage());
            }
          });
    } else {
      log.error("Directory does not exist: " + dirPath);
    }
  }
}
