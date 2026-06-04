package com.digitalLibrary.project.controller;

import com.digitalLibrary.project.dto.BookIssueDto;
import com.digitalLibrary.project.mapper.BookIssueDtoMapper;
import com.digitalLibrary.project.service.BookIssueService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookissue")
public class BookIssueController {

    private final BookIssueService bookIssueService;
    private final BookIssueDtoMapper bookIssueDtoMapper;  // add this


    public BookIssueController(BookIssueService bookIssueService, BookIssueDtoMapper bookIssueDtoMapper){
        this.bookIssueService = bookIssueService;
        this.bookIssueDtoMapper = bookIssueDtoMapper;
    }

    // add book issue
    @PostMapping("/add")
    public BookIssueEntity addBookIssue(@RequestBody BookIssueDto bookIssueDto){  // changed
        BookIssueEntity entity = bookIssueDtoMapper.toEntity(bookIssueDto);       // added
        return bookIssueService.addBookIssue(entity);
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
