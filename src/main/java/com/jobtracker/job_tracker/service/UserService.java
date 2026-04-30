package com.jobtracker.job_tracker.service;

import com.jobtracker.job_tracker.dto.RegisterRequest;
import com.jobtracker.job_tracker.dto.UserResponse;
import com.jobtracker.job_tracker.entity.User;
import com.jobtracker.job_tracker.exception.DuplicateResourceException;
import com.jobtracker.job_tracker.exception.ResourceNotFoundException;
import com.jobtracker.job_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;



    public User registerUser(RegisterRequest request) {

        // Business Rule 1: username must be unique

        if(userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already exists!");
        }

        // Business Rule 2: email must be unique

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered!");
        }

        // Business Rule 3: never save plain text password

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");

        return userRepository.save(user);
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id).map(this::mapToResponse);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public UserResponse mapToResponse(User user) {

        UserResponse userResponse = new UserResponse();
        userResponse.setId(user.getId());
        userResponse.setUsername(user.getUsername());
        userResponse.setEmail(user.getEmail());
        userResponse.setRole(user.getRole());
        return userResponse;
    }
}
