package com.jobtracker.job_tracker.service;

import com.jobtracker.job_tracker.dto.JobRequest;
import com.jobtracker.job_tracker.dto.JobResponse;
import com.jobtracker.job_tracker.entity.Job;
import com.jobtracker.job_tracker.exception.DuplicateResourceException;
import com.jobtracker.job_tracker.exception.ResourceNotFoundException;
import com.jobtracker.job_tracker.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public JobResponse createJob(JobRequest request) {

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setCompany(request.getCompany());
        job.setDescription(request.getDescription());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setStatus("OPEN");

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

    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Job not found with id: " + id));
        return mapToResponse(job);
    }

    public void deleteJob(Long id) {
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
        return response;
    }
}
