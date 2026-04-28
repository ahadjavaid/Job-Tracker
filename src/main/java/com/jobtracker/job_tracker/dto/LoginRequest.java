package com.jobtracker.job_tracker.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String username;
    private String password;
}
