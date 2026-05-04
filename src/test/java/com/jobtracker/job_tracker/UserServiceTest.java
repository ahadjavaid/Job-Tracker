package com.jobtracker.job_tracker;

import com.jobtracker.job_tracker.dto.RegisterRequest;
import com.jobtracker.job_tracker.entity.User;
import com.jobtracker.job_tracker.exception.DuplicateResourceException;
import com.jobtracker.job_tracker.repository.UserRepository;
import com.jobtracker.job_tracker.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {

        // This runs before EVERY test method
        // Creates fresh test data each time

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("abdulahad");
        testUser.setEmail("ahad@gmail.com");
        testUser.setRole("ROLE_USER");
        testUser.setPassword("encodedPassword123");
        testUser.setApplications(List.of());

        registerRequest = new RegisterRequest();
        registerRequest.setUsername("abdulahad");
        registerRequest.setEmail("ahad@gmail.com");
        registerRequest.setPassword("12345678");
    }

    // REGISTER USER TESTS

    @Test
    void registerUser_Success() {
        // ARRANGE — set up the scenario
        // Tell mock: username does NOT exist yet
        when(userRepository.existsByUsername("abdulahad"))
                .thenReturn(false);
        // Tell mock: email does NOT exist yet
        when(userRepository.existsByEmail("ahad@gmail.com"))
                .thenReturn(false);
        // Tell mock: encode any password → return this
        when(passwordEncoder.encode(anyString()))
                .thenReturn("encodedPassword123");
        // Tell mock: save any user → return our testUser
        when(userRepository.save(any(User.class)))
                .thenReturn(testUser);

        // ACT — run the actual method we are testing
        User result = userService.registerUser(registerRequest);

        // ASSERT — verify the result is what we expect
        assertNotNull(result);
        assertEquals("abdulahad", result.getUsername());
        assertEquals("ROLE_USER", result.getRole());
        assertEquals("encodedPassword123", result.getPassword());

        // Verify these methods were actually called
        verify(userRepository).existsByUsername("abdulahad");
        verify(userRepository).existsByEmail("ahad@gmail.com");
        verify(passwordEncoder).encode("12345678");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_ThrowsException_WhenUsernameExists() {

        // arrange:
        // tell mock username already exist

        when(userRepository.existsByUsername("abdulahad")).thenReturn(true);

        // ACT + ASSERT
        // We expect this exception to be thrown

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class, ()->
                userService.registerUser(registerRequest));

        // verify the message is correct

        assertEquals("Username already exists!",exception.getMessage());

        // verify save was never called because we stopped early

        verify(userRepository,never()).save(any(User.class));
    }
}

