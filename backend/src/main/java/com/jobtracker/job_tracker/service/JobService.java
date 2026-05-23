package com.jobtracker.job_tracker.service;

import com.jobtracker.job_tracker.dto.JobRequest;
import com.jobtracker.job_tracker.dto.JobResponse;
import com.jobtracker.job_tracker.entity.Job;
import com.jobtracker.job_tracker.exception.DuplicateResourceException;
import com.jobtracker.job_tracker.exception.ResourceNotFoundException;
import com.jobtracker.job_tracker.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.jobtracker.job_tracker.entity.User;
import com.jobtracker.job_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    public JobResponse createJob(JobRequest request) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User employer = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setStatus("OPEN");
        job.setEmployer(employer);

        Job saved = jobRepository.save(job);
        return mapToResponse(saved);
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<JobResponse> getOpenJobs() {
        return jobRepository.findByStatus("OPEN").stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<JobResponse> searchJobs(String keyword) {
        return jobRepository.findByTitleContainingIgnoreCase(keyword).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<JobResponse> getEmployerJobs(String username) {
        User employer = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Employer not found"));
        return jobRepository.findByEmployerId(employer.getId()).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Job not found with id: " + id));
        return mapToResponse(job);
    }

    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin && (job.getEmployer() == null || !job.getEmployer().getUsername().equals(username))) {
            throw new RuntimeException("You are not authorized to delete this job");
        }
        
        jobRepository.deleteById(id);
    }

    // Helper method - converts Job entity to JobResponse DTO
    private JobResponse mapToResponse(Job job) {

        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setCompany(job.getCompany());
        response.setDescription(job.getDescription());
        response.setLocation(job.getLocation());
        response.setJobType(job.getJobType());
        response.setStatus(job.getStatus());
        response.setPostedAt(job.getPostedAt());
        if (job.getEmployer() != null) {
            response.setEmployerUsername(job.getEmployer().getUsername());
        }
        return response;
    }
}
