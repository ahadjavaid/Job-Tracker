package com.jobtracker.job_tracker.dto;

import lombok.Data;

@Data
public class JobRequest {

    private String title;
    private String company;
    private String description;
    private String location;
    private String jobType;

}
