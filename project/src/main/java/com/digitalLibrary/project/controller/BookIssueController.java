package com.digitalLibrary.project.controller;

import com.digitalLibrary.project.service.BookIssueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookissue")
public class BookIssueController {

    private final BookIssueService bookIssueService;

    public BookIssueController(BookIssueService bookIssueService){
        this.bookIssueService = bookIssueService;
    }

    // add book issue
    @PostMapping("/add")
    public BookIssueEntity addBookIssue(@RequestBody BookIssueEntity bookIssueEntity){
        return bookIssueService.addBookIssue(bookIssueEntity);
    }

    // get all
    @GetMapping("/all")
    public List<BookIssueEntity> getAll(){
        return bookIssueService.getAll();
    }

    // get by id
    @GetMapping("/{id}")
    public BookIssueEntity getById(@PathVariable Integer id){
        return bookIssueService.getById(id);
    }

    // delete
    @DeleteMapping("/{id}")
    public String deleteBookIssue(@PathVariable Integer id){
        bookIssueService.deleteBookIssue(id);
        return "Book issue deleted successfully";
    }
}
