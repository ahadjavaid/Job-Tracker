package com.jobtracker.job_tracker.dto;

import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

import java.time.LocalDateTime;

@JsonPropertyOrder({
        "id",
        "applicantUsername",
        "jobTitle",
        "company",
        "status",
        "appliedAt"
})

@Data
public class ApplicationResponse {

    private Long id;
    private String status;
    private LocalDateTime appliedAt;
    private String jobTitle;
    private String company;
    private String applicantUsername;

}
