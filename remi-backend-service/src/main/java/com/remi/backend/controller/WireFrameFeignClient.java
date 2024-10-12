package com.remi.backend.controller;

import com.remi.backend.model.dtos.WireFrameRequest;
import com.remi.backend.model.dtos.WireFrameResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "wireFrameFeignClient", url = "${wireframe.baseurl}")
public interface WireFrameFeignClient {

  @PostMapping("${wireframe.boxdetection.endpoint}")
  WireFrameResponse detectBoxes(@RequestBody WireFrameRequest wireFrameRequest);

}
