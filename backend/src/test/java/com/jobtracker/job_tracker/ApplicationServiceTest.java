package com.jobtracker.job_tracker;

import com.jobtracker.job_tracker.dto.ApplicationResponse;
import com.jobtracker.job_tracker.entity.Application;
import com.jobtracker.job_tracker.entity.Job;
import com.jobtracker.job_tracker.entity.User;
import com.jobtracker.job_tracker.exception.BadRequestException;
import com.jobtracker.job_tracker.exception.DuplicateResourceException;
import com.jobtracker.job_tracker.exception.ResourceNotFoundException;
import com.jobtracker.job_tracker.repository.ApplicationRepository;
import com.jobtracker.job_tracker.repository.JobRepository;
import com.jobtracker.job_tracker.repository.UserRepository;
import com.jobtracker.job_tracker.service.ApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private ApplicationService applicationService;

    private User testUser;
    private Job testJob;
    private Application testApplication;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("abdulahad");
        testUser.setEmail("ahad@gmail.com");
        testUser.setRole("ROLE_USER");
        testUser.setPassword("encodedPassword123");
        testUser.setApplications(List.of());

        testJob = new Job();
        testJob.setId(1L);
        testJob.setTitle("Java Developer");
        testJob.setCompany("ABC Technologies");
        testJob.setDescription("Spring Boot expert needed");
        testJob.setLocation("Lahore, Pakistan");
        testJob.setJobType("FULL_TIME");
        testJob.setStatus("OPEN");
        testJob.setPostedAt(LocalDateTime.now());
        testJob.setApplications(List.of());

        testApplication = new Application();
        testApplication.setId(1L);
        testApplication.setUser(testUser);
        testApplication.setJob(testJob);
        testApplication.setStatus("APPLIED");
        testApplication.setAppliedAt(LocalDateTime.now());
    }

    // ─────────────────────────────────────────
    // APPLY TO JOB TESTS
    // ─────────────────────────────────────────

    @Test
    void applyToJob_Success() {
        // ARRANGE
        when(userRepository.findByUsername("abdulahad"))
                .thenReturn(Optional.of(testUser));
        when(jobRepository.findById(1L))
                .thenReturn(Optional.of(testJob));
        when(applicationRepository
                .existsByUserIdAndJobId(1L, 1L))
                .thenReturn(false);
        when(applicationRepository.save(
                any(Application.class)))
                .thenReturn(testApplication);

        // ACT
        ApplicationResponse result =
                applicationService.applyToJob(
                        "abdulahad", 1L);

        // ASSERT
        assertNotNull(result);
        assertEquals("APPLIED", result.getStatus());
        assertEquals("Java Developer",
                result.getJobTitle());
        assertEquals("abdulahad",
                result.getApplicantUsername());
        verify(applicationRepository)
                .save(any(Application.class));
    }

    @Test
    void applyToJob_ThrowsException_WhenUserNotFound() {
        // ARRANGE
        when(userRepository.findByUsername("unknown"))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThrows(
                ResourceNotFoundException.class,
                () -> applicationService.applyToJob(
                        "unknown", 1L)
        );

        // save should never be called!!
        verify(applicationRepository, never())
                .save(any(Application.class));
    }

    @Test
    void applyToJob_ThrowsException_WhenJobNotFound() {
        // ARRANGE
        when(userRepository.findByUsername("abdulahad"))
                .thenReturn(Optional.of(testUser));
        when(jobRepository.findById(999L))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThrows(
                ResourceNotFoundException.class,
                () -> applicationService.applyToJob(
                        "abdulahad", 999L)
        );

        verify(applicationRepository, never())
                .save(any(Application.class));
    }

    @Test
    void applyToJob_ThrowsException_WhenJobIsClosed() {
        // ARRANGE
        testJob.setStatus("CLOSED");

        when(userRepository.findByUsername("abdulahad"))
                .thenReturn(Optional.of(testUser));
        when(jobRepository.findById(1L))
                .thenReturn(Optional.of(testJob));

        // ACT + ASSERT
        BadRequestException exception =
                assertThrows(
                        BadRequestException.class,
                        () -> applicationService.applyToJob(
                                "abdulahad", 1L)
                );

        assertEquals(
                "This job is no longer accepting applications!",
                exception.getMessage()
        );

        verify(applicationRepository, never())
                .save(any(Application.class));
    }

    @Test
    void applyToJob_ThrowsException_WhenAlreadyApplied() {
        // ARRANGE
        when(userRepository.findByUsername("abdulahad"))
                .thenReturn(Optional.of(testUser));
        when(jobRepository.findById(1L))
                .thenReturn(Optional.of(testJob));
        // User already applied!!
        when(applicationRepository
                .existsByUserIdAndJobId(1L, 1L))
                .thenReturn(true);

        // ACT + ASSERT
        DuplicateResourceException exception =
                assertThrows(
                        DuplicateResourceException.class,
                        () -> applicationService.applyToJob(
                                "abdulahad", 1L)
                );

        assertEquals(
                "You have already applied to this job!",
                exception.getMessage()
        );

        verify(applicationRepository, never())
                .save(any(Application.class));
    }

    // ─────────────────────────────────────────
    // GET USER APPLICATIONS TESTS
    // ─────────────────────────────────────────

    @Test
    void getUserApplications_ReturnsApplications() {
        // ARRANGE
        when(userRepository.findByUsername("abdulahad"))
                .thenReturn(Optional.of(testUser));
        when(applicationRepository.findByUserId(1L))
                .thenReturn(List.of(testApplication));

        // ACT
        List<ApplicationResponse> result =
                applicationService.getUserApplications(
                        "abdulahad");

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("APPLIED",
                result.get(0).getStatus());
        assertEquals("Java Developer",
                result.get(0).getJobTitle());
    }

    @Test
    void getUserApplications_ReturnsEmpty_WhenNoApplications() {
        // ARRANGE
        when(userRepository.findByUsername("abdulahad"))
                .thenReturn(Optional.of(testUser));
        when(applicationRepository.findByUserId(1L))
                .thenReturn(List.of());

        // ACT
        List<ApplicationResponse> result =
                applicationService.getUserApplications(
                        "abdulahad");

        // ASSERT
        assertNotNull(result);
        assertEquals(0, result.size());
    }

    // ─────────────────────────────────────────
    // UPDATE STATUS TESTS
    // ─────────────────────────────────────────

    @Test
    void updateStatus_Success() {
        // ARRANGE
        when(applicationRepository.findById(1L))
                .thenReturn(Optional.of(testApplication));
        when(applicationRepository.save(
                any(Application.class)))
                .thenReturn(testApplication);

        // ACT
        ApplicationResponse result =
                applicationService.updateStatus(
                        1L, "INTERVIEW");

        // ASSERT
        assertNotNull(result);
        verify(applicationRepository)
                .save(any(Application.class));
    }

    @Test
    void updateStatus_ThrowsException_WhenNotFound() {
        // ARRANGE
        when(applicationRepository.findById(999L))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        assertThrows(
                ResourceNotFoundException.class,
                () -> applicationService.updateStatus(
                        999L, "INTERVIEW")
        );

        verify(applicationRepository, never())
                .save(any(Application.class));
    }

    // ─────────────────────────────────────────
    // GET ALL APPLICATIONS TESTS
    // ─────────────────────────────────────────

    @Test
    void getAllApplications_ReturnsAllApplications() {
        // ARRANGE
        when(applicationRepository.findAll())
                .thenReturn(List.of(testApplication));

        // ACT
        List<ApplicationResponse> result =
                applicationService.getAllApplications();

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("abdulahad",
                result.get(0).getApplicantUsername());
        verify(applicationRepository).findAll();
    }
}