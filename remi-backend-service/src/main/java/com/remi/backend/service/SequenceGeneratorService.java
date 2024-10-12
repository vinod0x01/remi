package com.remi.backend.service;

import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;

import com.remi.backend.model.DatabaseSequence;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

@Service
public class SequenceGeneratorService {

  @Autowired
  private MongoOperations mongoOperations;

  public long getSequenceNumber(String sequenceName) {

    Query query = new Query(Criteria.where("id").is(sequenceName));
    Update update = new Update().inc("seq", 1);

    DatabaseSequence counter = mongoOperations.findAndModify(
        query, update,
        options().returnNew(true).upsert(true),
        DatabaseSequence.class);

    return !Objects.isNull(counter)? counter.getSeq() : 1;
  }

}
