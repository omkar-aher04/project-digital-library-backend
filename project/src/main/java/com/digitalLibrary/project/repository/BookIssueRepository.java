package com.digitalLibrary.project.repository;

import com.digitalLibrary.project.controller.BookIssueEntity;
import com.digitalLibrary.project.db_response.BookIssueCount;
import com.digitalLibrary.project.entity.BookEntity;
import com.digitalLibrary.project.jpaRepository.BookIssueJpaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public class BookIssueRepository {
    private final BookIssueJpaRepository bookIssueJpaRepository;

    public BookIssueRepository(BookIssueJpaRepository bookIssueJpaRepository){
        this.bookIssueJpaRepository = bookIssueJpaRepository;
    }

    //addBookIssue
    public BookIssueEntity addBookIssue(BookIssueEntity bookIssueEntity) {
        return this.bookIssueJpaRepository.save(bookIssueEntity);
    }
    //getAll
    public List<BookIssueEntity> getAll(){
        return bookIssueJpaRepository.findAll();
    }
    //getById
    public BookIssueEntity getById(Integer id) {
        return this.bookIssueJpaRepository.findById(id).orElse(null);
    }

    public void deleteById(Integer id) {
        bookIssueJpaRepository.deleteById(id);
    }
    //getTopNIssuedBooks
    public List<BookIssueCount> getTopNIssuedBooks(int n) {
        Pageable topN = PageRequest.of(0, n);
        return this.bookIssueJpaRepository.findMostIssuedBooks(topN);
    }
    //getAllActiveBooksIssuedByUser
    public List<BookEntity> getAllActiveBooksIssuedByUser(long userId) {
        LocalDate currentDate = LocalDate.now();
        return this.bookIssueJpaRepository
                .findByUserEntity_IdAndExpiryDateGreaterThanEqual(userId, currentDate)
                .stream()
                .map(BookIssueEntity::getBookEntity)
                .toList(); // Java 17 and above
    }
}
