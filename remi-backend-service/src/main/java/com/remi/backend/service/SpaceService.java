package com.remi.backend.service;

import com.remi.backend.model.Space;
import com.remi.backend.model.dtos.AddMemberRequest;
import com.remi.backend.model.dtos.FinalizedBoxesRequest;
import com.remi.backend.model.dtos.WireFrameResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;
import org.springframework.web.multipart.MultipartFile;

public interface SpaceService {

  public List<Space> getSpaces(HttpServletRequest request) throws Exception;

  public Space addSpace(String spaceName, String userName) throws Exception;

  public Space uploadImages(String spaceId, String userName, MultipartFile[] files) throws Exception;

  public WireFrameResponse detectBoxes(String base64Image);

  public Space detectBoxForSpace(Space space) throws Exception;

  public Space finalisedBoxDetails(FinalizedBoxesRequest FinalizedBoxesRequest) throws Exception;

  public Space finalisedBoxDetails(List<FinalizedBoxesRequest> FinalizedBoxesRequests) throws Exception;

  public Space getSpace(String spaceId);

  public String deleteSpace(String spaceId, HttpServletRequest request) throws Exception;

  public Map<String, String> searchUser(String userName) throws Exception;

  public Space addMemberToSpace(AddMemberRequest addMemberRequest, HttpServletRequest request) throws Exception;

  public Space deleteMemberFromSpace(String spaceId, String memberId, HttpServletRequest request) throws Exception;

  public Space updateOwnerForSpace(String spaceID, String newOwnerId, HttpServletRequest request) throws Exception;

}
