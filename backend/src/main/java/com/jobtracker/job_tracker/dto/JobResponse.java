package com.jobtracker.job_tracker.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobResponse {

    private Long id;
    private String title;
    private String company;
    private String description;
    private String location;
    private String jobType;
    private String status;
    private LocalDateTime postedAt;
    private String employerUsername;

}
