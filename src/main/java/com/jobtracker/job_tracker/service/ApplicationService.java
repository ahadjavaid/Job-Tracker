package com.jobtracker.job_tracker.service;

import com.jobtracker.job_tracker.dto.ApplicationResponse;
import com.jobtracker.job_tracker.entity.Application;
import com.jobtracker.job_tracker.entity.Job;
import com.jobtracker.job_tracker.entity.User;
import com.jobtracker.job_tracker.repository.ApplicationRepository;
import com.jobtracker.job_tracker.repository.JobRepository;
import com.jobtracker.job_tracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found!"));

        // Business Rule 2: job must exist
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));

        // Business Rule 3: job must be open
        if(!job.getStatus().equals("OPEN")) {
            throw new RuntimeException("This job is no longer accepting applications!");
        }

        // Business Rule 4: user cannot apply twice to same job
        if(applicationRepository.existsByUserIdAndJobId(user.getId(), jobId)) {
            throw new RuntimeException("You have already applied to this job!");
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
                () -> new RuntimeException("User not found!"));

        return applicationRepository.findByUserId(user.getId()).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ApplicationResponse updateStatus(Long applicationId, String newStatus) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found!"));

        application.setStatus(newStatus);
        return  mapToResponse(applicationRepository.save(application));
    }

    private ApplicationResponse mapToResponse(Application app) {

        ApplicationResponse response = new ApplicationResponse();
        response.setId(app.getId());
        response.setStatus(app.getStatus());
        response.setAppliedAt(app.getAppliedAt());
        response.setJobTitle(app.getJob().getTitle());
        response.setCompany(app.getJob().getCompany());
        response.setApplicantUsername(app.getUser().getUsername());
        return  response;
    }
}
