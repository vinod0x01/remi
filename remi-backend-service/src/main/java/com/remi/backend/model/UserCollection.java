package com.remi.backend.model;

import com.remi.backend.Constants.SEQUENCES;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "user_collection")
public class UserCollection {

  @Transient
  private static final String SEQUENCE_NAME = String.valueOf(SEQUENCES.USER_SEQUENCE);

  @Id
  private long user_id;

  @Field
  @NotNull
  private String email;

  @Field
  @NotNull
  private String first_name;

  @Field
  private String last_name;

  @Field
   private String password;

  @Field
  private List<Long> members;

  @Field
  private List<Long> spaces;
}
