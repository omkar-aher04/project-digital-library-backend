package com.digitalLibrary.project.repository;

import com.digitalLibrary.project.entity.UserEntity;
import com.digitalLibrary.project.jpaRepository.UserJpaRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public class UserRepository {
@Autowired
    private final UserJpaRepository userJpaRepository;

    public UserRepository(UserJpaRepository userJpaRepository) {
        this.userJpaRepository = userJpaRepository;
    }

    public UserEntity findById(Integer id) {
        return userJpaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    //add user in db
    public UserEntity saveUser(UserEntity userEntity) throws BadRequestException {
        if(userJpaRepository.existsByEmail(userEntity.getEmail())){
            throw new BadRequestException("Email already exists!!");
        }
        return userJpaRepository.save(userEntity);
    }

    //Read User or Get users
    public List<UserEntity> getUserByFirstName(String firstName){
        return userJpaRepository.getUserByFirstName(firstName);
    }

    //Get All users
    public List<UserEntity> getAllUsers(){
        return userJpaRepository.findAll();
    }
    // check for duplicate email
     public boolean existsByEmail(String email) {
        return userJpaRepository.existsByEmail(email);
    }

    public List<UserEntity> findAll() {
        return userJpaRepository.findAll();
    }

    public UserEntity save(UserEntity userEntity) {
        return userJpaRepository.save(userEntity);
    }

    public void deleteById(Integer id) {
         userJpaRepository.deleteById(id);
    }

    public UserEntity getUserById(int userId) {
        return userJpaRepository.getUserById(userId);
    }
    public UserEntity findByEmail(String email) {
        return userJpaRepository.findByEmail(email);
    }
}
