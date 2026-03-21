package com.digitalLibrary.project.db_response;

import com.digitalLibrary.project.entity.BookEntity;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

@JsonDeserialize
@JsonSerialize
public record BookIssueCount(BookEntity bookEntity, long issueCount) {}