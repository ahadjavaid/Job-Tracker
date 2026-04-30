package com.jobtracker.job_tracker.controller;

import com.jobtracker.job_tracker.dto.LoginRequest;
import com.jobtracker.job_tracker.dto.LoginResponse;
import com.jobtracker.job_tracker.entity.User;
import com.jobtracker.job_tracker.repository.UserRepository;
import com.jobtracker.job_tracker.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {

        // verify username and password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword()));

        // get username from authenticated object
        String username = authentication.getName();

        // get user from database to find their role
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new RuntimeException("user not found!"));

        // generate JWT token
        String token = jwtUtil.generateToken(username,user.getRole());

        // return token + user info
        return  ResponseEntity.ok(new LoginResponse(token,username,user.getRole()));
    }
}
