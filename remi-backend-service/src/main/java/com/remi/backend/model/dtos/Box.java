package com.remi.backend.model.dtos;

import com.remi.backend.Constants.SEQUENCES;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Transient;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Box {

//  @Transient
//  private static final String BOX_SEQUENCE = String.valueOf(SEQUENCES.BOX_SEQUENCE);

  @NotNull
  private int box_id;
  @NotNull
  private String box_name;
  @NotNull
  private List<Coordinate> coordinates;

}
