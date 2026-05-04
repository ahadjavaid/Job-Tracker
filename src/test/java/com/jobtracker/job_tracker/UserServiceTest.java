package com.jobtracker.job_tracker;

import com.jobtracker.job_tracker.dto.RegisterRequest;
import com.jobtracker.job_tracker.dto.UserResponse;
import com.jobtracker.job_tracker.entity.User;
import com.jobtracker.job_tracker.exception.DuplicateResourceException;
import com.jobtracker.job_tracker.exception.ResourceNotFoundException;
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
import java.util.Optional;

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


    @Test
    void registerUser_ThrowsException_WhenEmailExists() {

        // arrange:
        // tell mock username already exist

        when(userRepository.existsByEmail("ahad@gmail.com")).thenReturn(true);

        // ACT + ASSERT
        // We expect this exception to be thrown

        DuplicateResourceException exception = assertThrows(DuplicateResourceException.class, ()->
                userService.registerUser(registerRequest));

        // verify the message is correct

        assertEquals("Email already registered!",exception.getMessage());

        // verify save was never called because we stopped early

        verify(userRepository,never()).save(any(User.class));
    }

    // ─────────────────────────────────────────
    // GET ALL USERS TESTS
    // ─────────────────────────────────────────

    @Test
    void getAllUsers_ReturnsListOfUsers() {

        when(userRepository.findAll()).thenReturn(List.of(testUser));

        // ACT
        List<UserResponse> result = userService.getAllUsers();

        // ASSERT
        assertNotNull(result);
        assertEquals(1,result.size());
        assertEquals("abdulahad",result.get(0).getUsername());
        assertEquals("ahad@gmail.com",result.get(0).getEmail());

        verify(userRepository).findAll();

    }

    @Test
    void getAllUsers_ReturnsEmptyList_WhenNoUsers() {
        // arrange
        when(userRepository.findAll()).thenReturn(List.of());

        // ACT
        List<UserResponse> result = userService.getAllUsers();

        assertNotNull(result);
        assertEquals(0,result.size());
    }

    // ─────────────────────────────────────────
    // GET USER BY ID TESTS
    // ─────────────────────────────────────────

    @Test
    void getUserById_ReturnsUser_WhenExists() {
        // ARRANGE
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // ACT
        Optional<UserResponse> result = userService.getUserById(1L);

        // ASSERT

        assertTrue(result.isPresent());
        assertEquals("abdulahad",result.get().getUsername());

        verify(userRepository).findById(1L);
    }

    @Test
    void getUserById_ReturnsEmpty_WhenNoUserExists() {
        // ARRANGE
        when(userRepository.findById(999L)).thenReturn(Optional.empty());

        //ACT
        Optional<UserResponse> result = userService.getUserById(999L);

        // ASSERT
        assertFalse(result.isPresent());
    }


    // ─────────────────────────────────────────
    // DELETE USER TESTS
    // ─────────────────────────────────────────

    @Test
    void deleteUser_Success() {
        // ARRANGE
        when(userRepository.existsById(1L))
                .thenReturn(true);
        // void method — just do nothing when called
        doNothing().when(userRepository).deleteById(1L);

        // ACT
        userService.deleteUser(1L);

        // ASSERT
        // Verify deleteById was actually called once
        verify(userRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteUser_ThrowsException_WhenNotFound() {
        // ARRANGE
        when(userRepository.existsById(999L))
                .thenReturn(false);

        // ACT + ASSERT
        assertThrows(
                ResourceNotFoundException.class,
                () -> userService.deleteUser(999L)
        );

        // deleteById should NEVER be called
        verify(userRepository, never()).deleteById(999L);
    }
}

