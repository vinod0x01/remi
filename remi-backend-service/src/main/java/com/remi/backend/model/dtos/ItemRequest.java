package com.remi.backend.model.dtos;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequest {

  private String item_name;
  private String space_id;
  private int image_id;
  private int box_id;

}
