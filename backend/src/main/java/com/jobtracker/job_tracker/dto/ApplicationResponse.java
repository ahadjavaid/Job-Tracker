package com.jobtracker.job_tracker.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDateTime;

@JsonPropertyOrder({
        "id",
        "userId",
        "applicantUsername",
        "jobTitle",
        "jobType",
        "jobDescription",
        "jobLocation",
        "company",
        "status",
        "appliedAt"
})

@Data
public class ApplicationResponse {

    private Long id;
    private Long userId;
    private String status;
    private LocalDateTime appliedAt;
    private String jobTitle;
    private String jobType;
    private String jobDescription;
    private String jobLocation;
    private String company;
    private String applicantUsername;
    private String applicantEmail;

}
