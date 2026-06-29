package com.digitalLibrary.project.impl;

import com.digitalLibrary.project.entity.UserEntity;
import com.digitalLibrary.project.repository.UserRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailService implements UserDetailsService {

        private final UserRepository userRepository;

        public UserDetailService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }

        @Override
        public UserDetails loadUserByUsername(String email)
                throws UsernameNotFoundException {

            UserEntity user = userRepository.findByEmail(email);

            return org.springframework.security.core.userdetails.User
                    .withUsername(user.getEmail())
                    .password(user.getPassword())
                    .roles("USER")
                    .build();
        }
    }
