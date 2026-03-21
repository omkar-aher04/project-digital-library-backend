package com.digitalLibrary.project.jpaRepository;

import com.digitalLibrary.project.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, Integer> {
   List<UserEntity> getUserByFirstName(String firstName);
    boolean existsByEmail(String email);

    UserEntity getUserById(Integer id);
}


