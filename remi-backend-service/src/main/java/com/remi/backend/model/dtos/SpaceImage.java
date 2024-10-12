package com.remi.backend.model.dtos;

import java.util.ArrayList;
import java.util.List;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SpaceImage {

  private Integer id;

  private String space_image;
  private List<List<Coordinate>> initial_boxes_coordinates;
  private List<Box> finalized_boxes;

  public SpaceImage(String image) {
    this.space_image = image;
  }

  public void addCoordinate(List<List<Coordinate>> coordinates) {
    this.initial_boxes_coordinates = coordinates;
  }

  public void addFinalizedBox(Box box) {
    if (null == this.finalized_boxes) {
      this.finalized_boxes = new ArrayList<>();
    }
    this.finalized_boxes.add(box);
  }

}
