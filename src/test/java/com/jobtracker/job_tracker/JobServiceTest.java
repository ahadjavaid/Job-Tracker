package com.jobtracker.job_tracker;

import com.jobtracker.job_tracker.dto.JobRequest;
import com.jobtracker.job_tracker.dto.JobResponse;
import com.jobtracker.job_tracker.entity.Job;
import com.jobtracker.job_tracker.exception.ResourceNotFoundException;
import com.jobtracker.job_tracker.repository.JobRepository;
import com.jobtracker.job_tracker.service.JobService;
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
public class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobService jobService;

    private Job testJob;
    private JobRequest jobRequest;

    @BeforeEach
    void setUp() {
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

        jobRequest = new JobRequest();
        jobRequest.setTitle("Java Developer");
        jobRequest.setCompany("ABC Technologies");
        jobRequest.setDescription("Spring Boot expert needed");
        jobRequest.setLocation("Lahore, Pakistan");
        jobRequest.setJobType("FULL_TIME");
    }

    // ─────────────────────────────────────────
    // CREATE JOB TESTS
    // ─────────────────────────────────────────

    @Test
    void createJob_Success() {
        // ARRANGE
        when(jobRepository.save(any(Job.class)))
                .thenReturn(testJob);

        // ACT
        JobResponse result = jobService.createJob(jobRequest);

        // ASSERT
        assertNotNull(result);
        assertEquals("Java Developer", result.getTitle());
        assertEquals("ABC Technologies", result.getCompany());
        assertEquals("OPEN", result.getStatus());
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    void createJob_SetsStatusToOpen_Automatically() {
        // ARRANGE
        when(jobRepository.save(any(Job.class)))
                .thenReturn(testJob);

        // ACT
        JobResponse result = jobService.createJob(jobRequest);

        // ASSERT
        // Status must always be OPEN when job is created
        // User should never set this manually!!
        assertEquals("OPEN", result.getStatus());
    }

    // ─────────────────────────────────────────
    // GET ALL JOBS TESTS
    // ─────────────────────────────────────────

    @Test
    void getAllJobs_ReturnsAllJobs() {
        // ARRANGE
        when(jobRepository.findAll())
                .thenReturn(List.of(testJob));

        // ACT
        List<JobResponse> result = jobService.getAllJobs();

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Java Developer",
                result.get(0).getTitle());
        verify(jobRepository).findAll();
    }

    @Test
    void getAllJobs_ReturnsEmptyList_WhenNoJobs() {
        // ARRANGE
        when(jobRepository.findAll())
                .thenReturn(List.of());

        // ACT
        List<JobResponse> result = jobService.getAllJobs();

        // ASSERT
        assertNotNull(result);
        assertEquals(0, result.size());
    }

    // ─────────────────────────────────────────
    // GET OPEN JOBS TESTS
    // ─────────────────────────────────────────

    @Test
    void getOpenJobs_ReturnsOnlyOpenJobs() {
        // ARRANGE
        when(jobRepository.findByStatus("OPEN"))
                .thenReturn(List.of(testJob));

        // ACT
        List<JobResponse> result = jobService.getOpenJobs();

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("OPEN", result.get(0).getStatus());
        verify(jobRepository).findByStatus("OPEN");
    }

    // ─────────────────────────────────────────
    // GET JOB BY ID TESTS
    // ─────────────────────────────────────────

    @Test
    void getJobById_ReturnsJob_WhenExists() {
        // ARRANGE
        when(jobRepository.findById(1L))
                .thenReturn(Optional.of(testJob));

        // ACT
        JobResponse result = jobService.getJobById(1L);

        // ASSERT
        assertNotNull(result);
        assertEquals("Java Developer", result.getTitle());
        assertEquals(1L, result.getId());
        verify(jobRepository).findById(1L);
    }

    @Test
    void getJobById_ThrowsException_WhenNotFound() {
        // ARRANGE
        when(jobRepository.findById(999L))
                .thenReturn(Optional.empty());

        // ACT + ASSERT
        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> jobService.getJobById(999L)
                );

        assertEquals(
                "Job not found with id: 999",
                exception.getMessage()
        );
    }

    // ─────────────────────────────────────────
    // SEARCH JOBS TESTS
    // ─────────────────────────────────────────

    @Test
    void searchJobs_ReturnsMatchingJobs() {
        // ARRANGE
        when(jobRepository
                .findByTitleContainingIgnoreCase("java"))
                .thenReturn(List.of(testJob));

        // ACT
        List<JobResponse> result =
                jobService.searchJobs("java");

        // ASSERT
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getTitle()
                .toLowerCase().contains("java"));
    }

    @Test
    void searchJobs_ReturnsEmptyList_WhenNoMatch() {
        // ARRANGE
        when(jobRepository
                .findByTitleContainingIgnoreCase("python"))
                .thenReturn(List.of());

        // ACT
        List<JobResponse> result =
                jobService.searchJobs("python");

        // ASSERT
        assertNotNull(result);
        assertEquals(0, result.size());
    }

    // ─────────────────────────────────────────
    // DELETE JOB TESTS
    // ─────────────────────────────────────────

    @Test
    void deleteJob_Success() {
        // ARRANGE
        when(jobRepository.existsById(1L))
                .thenReturn(true);
        doNothing().when(jobRepository).deleteById(1L);

        // ACT
        jobService.deleteJob(1L);

        // ASSERT
        verify(jobRepository, times(1)).deleteById(1L);
    }

    @Test
    void deleteJob_ThrowsException_WhenNotFound() {
        // ARRANGE
        when(jobRepository.existsById(999L))
                .thenReturn(false);

        // ACT + ASSERT
        assertThrows(
                ResourceNotFoundException.class,
                () -> jobService.deleteJob(999L)
        );

        verify(jobRepository, never()).deleteById(999L);
    }
}