package com.digitalLibrary.project.controller;

import com.digitalLibrary.project.service.UserService;
import com.digitalLibrary.project.entity.UserEntity;
import com.digitalLibrary.project.repository.UserRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;
    private UserRepository userRepository;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    // add user in DB
    @PostMapping("/addUser")
    public UserEntity saveUser(@RequestBody UserEntity userEntity) throws BadRequestException {
       return userService.saveUser(userEntity);
    }
    // get user by username
    @GetMapping("/name")
    public List<UserEntity> getUserByFirstName(@RequestParam String firstName){
        return userService.getUserByFirstName(firstName);
    }

    // get all data of users
    @GetMapping("/")
    public List<UserEntity> getAllUsers(){
        return userService.getAllUsers();
    }
    // delete user
    @DeleteMapping("/{id}")
    public String deleteUserById(@PathVariable Integer id){
        return  userService.deleteById(id);
    }
}
