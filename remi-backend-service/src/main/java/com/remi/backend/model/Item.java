package com.remi.backend.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "items")
public class Item {

  @Id
  private String item_id;

  @NotBlank
  @Field("item_name")
  private String itemName;

  @NotBlank
  @Field("space_id")
  private String spaceId;

  @NotBlank
  @Field("box_id")
  private int boxId;

  @NotBlank
  @Field("image_id")
  private int imageId;

}
