package com.remi.backend.model.dtos;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinalizedBoxesRequest {

  private String space_id;
  private int image_id;
  private int box_id;
  private String box_name;
  List<Coordinate> coordinates;
}
