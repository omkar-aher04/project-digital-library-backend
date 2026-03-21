package com.digitalLibrary.project.jpaRepository;

import com.digitalLibrary.project.controller.BookIssueEntity;
import com.digitalLibrary.project.db_response.BookIssueCount;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookIssueJpaRepository extends JpaRepository<BookIssueEntity,Integer> {

    @Query("""
            SELECT b.bookEntity AS book, COUNT(b.id) AS issueCount
            FROM BookIssueEntity b
            GROUP BY b.bookEntity
            ORDER BY COUNT(b.id) DESC
            """)
    List<BookIssueCount> findMostIssuedBooks(Pageable pageable);

    List<BookIssueEntity> findByUserEntity_IdAndExpiryDateGreaterThanEqual(long id, LocalDate expiryDate);

}
