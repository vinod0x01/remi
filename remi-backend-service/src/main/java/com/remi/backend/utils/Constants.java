package com.remi.backend.utils;

import org.springframework.beans.factory.annotation.Value;

public class Constants {

  @Value("${wireframe.url}")
  public static String wireFrameUrl;

}
