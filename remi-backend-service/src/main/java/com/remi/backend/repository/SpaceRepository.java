package com.remi.backend.repository;

import com.remi.backend.model.Space;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SpaceRepository extends MongoRepository<Space, String> {

  @Query("{ 'space_id' :  ?0 }")
  Optional<Space> findBySpaceID(String spaceID);

  @Query("{ '$or': [ { 'owner_id': ?0 }, { 'memberids':  ?0 } ] }")
  List<Space> findSpacesForUser(String userId);

  @Query(value = "{ '$or': [ { 'owner_id': ?0 }, { 'memberids':  ?0 } ] }",
  fields = "{ 'space_id' : 1 }")
  List<String> findSpaceIDsForUser(String userId);

  @Query(value = "{ 'space_id':  ?0 }",
      fields = "{ 'owner_id' : 1 }")
  String getOwnerNameForSpaceID(String spaceId);

}
