package com.digitalLibrary.project.mapper;

import com.digitalLibrary.project.controller.BookIssueEntity;
import com.digitalLibrary.project.dto.BookIssueDto;
import com.digitalLibrary.project.entity.BookEntity;
import com.digitalLibrary.project.entity.UserEntity;
import com.digitalLibrary.project.repository.BookRepository;
import com.digitalLibrary.project.repository.UserRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class BookIssueDtoMapper {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public BookIssueDtoMapper(BookRepository bookRepository,UserRepository userRepository){
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
    }
    public BookIssueEntity toEntity(BookIssueDto bookIssueDto) {
        UserEntity userEntity = this.userRepository.getUserById(bookIssueDto.getUserId());
        BookEntity bookEntity = this.bookRepository.getBookById(bookIssueDto.getBookId());
        LocalDate expiryDate = bookIssueDto.getIssueDate().plusDays(14);
        return BookIssueEntity.builder()
                .userEntity(userEntity)
                .bookEntity(bookEntity)
                .issueDate(bookIssueDto.getIssueDate())
                .expiryDate(expiryDate)
                .build();
    }

}
