package com.remi.backend.model;

import com.remi.backend.Constants.SEQUENCES;
import com.remi.backend.model.dtos.Box;
import com.remi.backend.model.dtos.Coordinate;
import com.remi.backend.model.dtos.SpaceImage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "spaces")
public class Space {

//  @Transient
//  private static final String SEQUENCE_NAME = String.valueOf(SEQUENCES.SPACE_SEQUENCE);

  @Id
  private String space_id;

  @NotBlank
  private String space_name;
  @NotBlank
  private String owner_id;

//  private List<String> space_images;
  private List<SpaceImage> space_images;

  private List<String> memberids;

  public Space(String space_name, String owner_id) {
    this.space_name = space_name;
    this.owner_id = owner_id;
  }

  public void addMember(String memberId) {
    if (null == this.memberids) {
      this.memberids = new ArrayList<>();
    }
    memberids.add(memberId);
  }

  public void addSpaceImage(SpaceImage spaceImage) {
    if (null == this.space_images) {
      this.space_images = new ArrayList<>();
    }
    // get last count
    int max_num = 1;

    if (this.space_images.size() > 0) {
      Optional<Integer> maxNum = this.space_images.stream()
          .map(SpaceImage::getId)
          .max(Comparator.naturalOrder());
      if (null != maxNum) {
        max_num = maxNum.get() + 1;
      }
    }

    spaceImage.setId(max_num);

    space_images.add(spaceImage);

  }

  public boolean isUserAuthorized(String user_name){
    return owner_id.equals(user_name) || (memberids != null && memberids.contains(user_name));
  }

}
