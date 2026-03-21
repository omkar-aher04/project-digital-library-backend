package com.digitalLibrary.project.service;

import com.digitalLibrary.project.entity.BookEntity;
import com.digitalLibrary.project.repository.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {
    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository){
        this.bookRepository = bookRepository;
    }

    //CRUD
    // add books
    public BookEntity addBook(BookEntity bookEntity){
       return bookRepository.addBook(bookEntity);
    }
    // fetch books
    public List<BookEntity> getAllBooks(){
        return bookRepository.getAllBooks();
    }
    //update books
    //delete books
    public String deleteById(Integer id){
        if(!bookRepository.existsById(id)){
            return "Book not found";
        }
        bookRepository.deleteById(id);
        return "Book deleted successfully";
    }
}
