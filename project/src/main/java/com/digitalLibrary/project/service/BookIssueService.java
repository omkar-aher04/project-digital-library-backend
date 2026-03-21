package com.digitalLibrary.project.service;

import com.digitalLibrary.project.controller.BookIssueEntity;
import com.digitalLibrary.project.db_response.BookIssueCount;
import com.digitalLibrary.project.entity.BookEntity;
import com.digitalLibrary.project.jpaRepository.BookIssueJpaRepository;
import com.digitalLibrary.project.repository.BookIssueRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookIssueService {

    private final BookIssueRepository bookIssueRepository;

    public BookIssueService(BookIssueRepository bookIssueRepository){
        this.bookIssueRepository = bookIssueRepository;
    }

    //addBookIssue
    public BookIssueEntity addBookIssue(BookIssueEntity bookIssueEntity) {
        return this.bookIssueRepository.addBookIssue(bookIssueEntity);
    }
    //getAll
    public List<BookIssueEntity> getAll(){
        return bookIssueRepository.getAll();
    }
    //getById
    public BookIssueEntity getById(Integer id) {
        return this.bookIssueRepository.getById(id);
    }
    // DELETE
    public void deleteBookIssue(Integer id) {
        this.bookIssueRepository.deleteById(id);
    }
    //getTopNIssuedBooks
    public List<BookIssueCount> getNMostIssuedBooks(int n) {
        return this.bookIssueRepository.getTopNIssuedBooks(n);
    }

    public List<BookEntity> getActiveBooksIssuedByUser(long userId) {
        return this.bookIssueRepository.getAllActiveBooksIssuedByUser(userId);
    }
    //getAllActiveBooksIssuedByUser
}
