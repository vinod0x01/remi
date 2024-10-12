package com.remi.backend.model;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@Document(collection = "user_spaces")
public class UserSpace {

  @Id
  private String user;

  private List<Map<String, List<String>>> spacemembers;
  private List<String> members;

  private List<String> spaces;

  public void appendSpace(String spaceId){
    if (this.spaces == null) {
      this.spaces = new LinkedList<>();
    }
    this.spaces.add(spaceId);
  }

  public void appendMember(String memberId){
    if (this.members == null) {
      this.members = new LinkedList<>();
    }
    this.members.add(memberId);
  }


}
