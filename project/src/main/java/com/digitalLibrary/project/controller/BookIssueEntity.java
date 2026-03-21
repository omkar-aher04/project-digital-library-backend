package com.digitalLibrary.project.controller;

import com.digitalLibrary.project.entity.BookEntity;
import com.digitalLibrary.project.entity.UserEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "book_issue")

public class BookIssueEntity {
    @Id
    @Column(name = "id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JoinColumn(name = "user_entity_id")
    @ManyToOne
    private UserEntity userEntity;

    @JoinColumn(name= "book_entity_id")
    @ManyToOne
    private BookEntity bookEntity;

    @Column(name = "issue_date", nullable = false)
    private LocalDate issueDate = LocalDate.now();

    @Column(name = "expiry_date", nullable = false)
    private LocalDate expiryDate;

}
