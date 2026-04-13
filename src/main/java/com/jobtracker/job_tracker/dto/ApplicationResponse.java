package com.jobtracker.job_tracker.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApplicationResponse {

    private Long id;
    private String status;
    private LocalDateTime appliedAt;
    private String jobTitle;
    private String company;
    private String applicantUsername;

}
