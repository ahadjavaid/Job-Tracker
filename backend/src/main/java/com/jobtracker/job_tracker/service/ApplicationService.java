package com.jobtracker.job_tracker.service;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;


    public ApplicationResponse applyToJob(String username, Long jobId) {

        // Business Rule 1: user must exist
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new ResourceNotFoundException("User not found!"));

        // Business Rule 2: job must exist
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        // Business Rule 3: job must be open
        if(!job.getStatus().equals("OPEN")) {
            throw new BadRequestException("This job is no longer accepting applications!");
        }

        // Business Rule 4: user cannot apply twice to same job
        if(applicationRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            throw new DuplicateResourceException("You have already applied to this job!");
        }

        Application application = new Application();
        application.setUser(user);
        application.setJob(job);
        application.setStatus("APPLIED");

        Application saved = applicationRepository.save(application);

        return mapToResponse(saved);
    }

    public List<ApplicationResponse> getUserApplications(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new ResourceNotFoundException("User not found!"));

        return applicationRepository.findByUserId(user.getId()).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ApplicationResponse updateStatus(Long applicationId, String newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found!"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Job job = application.getJob();
        if (!isAdmin && (job.getEmployer() == null || !job.getEmployer().getUsername().equals(username))) {
            throw new RuntimeException("You are not authorized to update this application status");
        }

        application.setStatus(newStatus);
        return  mapToResponse(applicationRepository.save(application));
    }

    public List<ApplicationResponse> getEmployerApplications(String username) {
        User employer = userRepository.findByUsername(username).orElseThrow(
                () -> new ResourceNotFoundException("Employer not found!"));
        return applicationRepository.findByJobEmployerId(employer.getId()).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private ApplicationResponse mapToResponse(Application app) {

        ApplicationResponse response = new ApplicationResponse();
        response.setId(app.getId());
        response.setUserId(app.getUser().getId());
        response.setStatus(app.getStatus());
        response.setAppliedAt(app.getAppliedAt());
        response.setJobTitle(app.getJob().getTitle());
        response.setCompany(app.getJob().getCompany());
        response.setApplicantUsername(app.getUser().getUsername());
        return  response;
    }
}
