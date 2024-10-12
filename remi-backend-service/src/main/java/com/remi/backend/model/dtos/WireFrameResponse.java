package com.remi.backend.model.dtos;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WireFrameResponse {

  private String message;
  private String image;
  private List<List<List<Integer>>> coordinates;

}
