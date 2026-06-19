package com.digitalLibrary.project.controller;

import com.digitalLibrary.project.entity.BookEntity;
import com.digitalLibrary.project.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {
    private final BookService bookService;

    public BookController ( BookService bookService){
        this.bookService = bookService;

    }
    //add books
    @PostMapping("/addbooks")
    public BookEntity addBook(@RequestBody BookEntity bookEntity){
        return bookService.addBook(bookEntity);
    }
    //get books
    @GetMapping("/allbooks")
    public List<BookEntity> getAllBooks(){
        return bookService.getAllBooks();
    }
    // delete books
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Integer id){
       return bookService.deleteById(id);
    }
    // update book
}
