package com.digitalLibrary.project.repository;

import com.digitalLibrary.project.controller.BookIssueEntity;
import com.digitalLibrary.project.entity.BookEntity;
import com.digitalLibrary.project.jpaRepository.BookJpaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BookRepository {
    private final BookJpaRepository bookJpaRepository;

    public BookRepository (BookJpaRepository bookJpaRepository){
        this.bookJpaRepository = bookJpaRepository;
    }
    //CRUD
    //add books
    public BookEntity addBook(BookEntity bookEntity){
        return bookJpaRepository.save(bookEntity);
    }

    //fetch books
    public List<BookEntity> getAllBooks(){
        return bookJpaRepository.findAll();
    }
    //update books

    //delete books
    public void deleteById(Integer id){
        bookJpaRepository.deleteById(id);
    }
    //check if exsists or not
    public boolean existsById(Integer id){
        return bookJpaRepository.existsById(id);
    }

    public BookEntity getBookById(Integer bookId) {
        return bookJpaRepository.getBookById(bookId);
    }


}
