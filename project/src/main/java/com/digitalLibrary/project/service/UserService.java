package com.digitalLibrary.project.service;

import com.digitalLibrary.project.entity.UserEntity;
import com.digitalLibrary.project.repository.UserRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    //add user in db
    public UserEntity saveUser(UserEntity userEntity) throws BadRequestException {
        if(userRepository.existsByEmail(userEntity.getEmail())){
            throw new BadRequestException("Email already exists!!");
        }
        return userRepository.save(userEntity);
    }

    //Read User or Get users
    public List<UserEntity> getUserByFirstName(String firstName){
        return userRepository.getUserByFirstName(firstName);
    }

    //Get All users
    public List<UserEntity> getAllUsers(){
        return userRepository.findAll();
    }

    // delete user using id
    public String deleteById(Integer id) {
         userRepository.deleteById(id);
         return "user deleted successfully!";
    }
}
