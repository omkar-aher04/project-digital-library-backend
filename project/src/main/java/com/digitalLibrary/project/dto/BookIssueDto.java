package com.digitalLibrary.project.dto;

import lombok.Data;
import tools.jackson.databind.annotation.JsonDeserialize;
import tools.jackson.databind.annotation.JsonSerialize;

import java.time.LocalDate;

@JsonDeserialize
@JsonSerialize

@Data
public class BookIssueDto {
    private int userId;
    private int bookId;
    private LocalDate issueDate = LocalDate.now();
}
