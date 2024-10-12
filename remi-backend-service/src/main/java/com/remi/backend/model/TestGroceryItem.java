package com.remi.backend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document("groceryitems")
public class TestGroceryItem {

  @Id
  private String id;

  @Field
  private String name;
  @Field
  private String nameItem;
  @Field
  private int quantity;
  @Field
  private String category;

}
