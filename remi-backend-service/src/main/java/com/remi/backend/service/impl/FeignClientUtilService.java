package com.remi.backend.service.impl;

import com.remi.backend.controller.WireFrameFeignClient;
import com.remi.backend.model.dtos.WireFrameRequest;
import com.remi.backend.model.dtos.WireFrameResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class FeignClientUtilService {

  @Autowired
  private WireFrameFeignClient wireFrameFeignClient;

  public WireFrameResponse callExternalServiceDetectBoxes(String base64Image) {
    WireFrameRequest wireFrameRequest = WireFrameRequest.builder()
        .imageBase64(base64Image)
        .build();
    log.info("Calling Wireframe to get deections");
    return wireFrameFeignClient.detectBoxes(wireFrameRequest);
  }

}
