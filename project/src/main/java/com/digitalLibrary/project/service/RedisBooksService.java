package com.digitalLibrary.project.service;

import com.digitalLibrary.project.entity.BookEntity;
import com.digitalLibrary.project.repository.BookRepository;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Service
public class RedisBooksService {

    private final RedisTemplate<String, Object> redisTemplate;
    private final BookRepository bookRepository;

    private static final String ALL_BOOKS_KEY = "books:all";
    private static final String BOOK_KEY      = "books:id:";

    public RedisBooksService(RedisTemplate<String, Object> redisTemplate,
                             BookRepository bookRepository) {
        this.redisTemplate  = redisTemplate;
        this.bookRepository = bookRepository;
    }

    // GET ALL
    public List<BookEntity> getAllBooks() {
        List<BookEntity> cached =
                (List<BookEntity>) redisTemplate.opsForValue().get(ALL_BOOKS_KEY);

        if (cached != null) {
            System.out.println(">> CACHE HIT  : " + ALL_BOOKS_KEY);
            return cached;
        }

        System.out.println(">> CACHE MISS : " + ALL_BOOKS_KEY);
        List<BookEntity> books = bookRepository.getAllBooks();
        redisTemplate.opsForValue().set(ALL_BOOKS_KEY, books, Duration.ofMinutes(10));
        return books;
    }

    // GET BY ID
    public BookEntity getBookById(Integer id) {
        String key = BOOK_KEY + id;

        BookEntity cached = (BookEntity) redisTemplate.opsForValue().get(key);
        if (cached != null) {
            System.out.println(">> CACHE HIT  : " + key);
            return cached;
        }

        System.out.println(">> CACHE MISS : " + key);
        BookEntity book = bookRepository.getBookById(id);
        if (book != null) {
            redisTemplate.opsForValue().set(key, book, Duration.ofMinutes(10));
        }
        return book;
    }

    // ADD — invalidate list cache
    public BookEntity addBook(BookEntity bookEntity) {
        BookEntity saved = bookRepository.addBook(bookEntity);
        redisTemplate.delete(ALL_BOOKS_KEY);
        System.out.println(">> CACHE CLEARED : " + ALL_BOOKS_KEY);
        return saved;
    }

    // DELETE — invalidate both caches
    public String deleteById(Integer id) {
        if (!bookRepository.existsById(id)) {
            return "Book not found";
        }
        bookRepository.deleteById(id);
        redisTemplate.delete(BOOK_KEY + id);
        redisTemplate.delete(ALL_BOOKS_KEY);
        System.out.println(">> CACHE CLEARED : " + BOOK_KEY + id + " & " + ALL_BOOKS_KEY);
        return "Book deleted successfully";
    }
}