package com.remi.backend.model.dtos;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WireFrameRequest {
  String imageBase64;
}
