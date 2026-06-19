package com.digitalLibrary.project.controller;

import com.digitalLibrary.project.entity.BookEntity;
import com.digitalLibrary.project.service.BookService;
import com.digitalLibrary.project.service.RedisBooksService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
public class BookController {
    private final BookService bookService;
    private final RedisBooksService redisBooksService;

    public BookController (BookService bookService, BookService bookService1, RedisBooksService redisBooksService){
        this.bookService = bookService1;
        this.redisBooksService = redisBooksService;

    }
    //add books
    @PostMapping("/addbooks")
    public BookEntity addBook(@RequestBody BookEntity bookEntity){
        return redisBooksService.addBook(bookEntity);
    }
    //get books
    @GetMapping("/allbooks")
    public List<BookEntity> getAllBooks(){
        return redisBooksService.getAllBooks();
    }
    // delete books
    @DeleteMapping("/{id}")
    public String deleteById(@PathVariable Integer id){
       return redisBooksService.deleteById(id);
    }
    // update book
}
