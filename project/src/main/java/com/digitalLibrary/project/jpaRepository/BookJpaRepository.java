package com.digitalLibrary.project.jpaRepository;

import com.digitalLibrary.project.entity.BookEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookJpaRepository extends JpaRepository<BookEntity,Integer> {


    BookEntity getBookById(Integer id);
}
